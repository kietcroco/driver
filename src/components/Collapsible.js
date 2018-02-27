"use strict";
import React from 'react';
import { Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import mergeStyle from '~/library/mergeStyle';

const ANIMATED_EASING_PREFIXES = ['easeInOut', 'easeOut', 'easeIn'];

class Collapsible extends React.Component {

	static displayName = "@Collapsible";

	static propTypes = {
		align: PropTypes.oneOf(['top', 'center', 'bottom']),
		collapsed: PropTypes.bool, // true = ẩn, false = hiện
		collapsedHeight: PropTypes.number,
		duration: PropTypes.number, // thời gian chạy hiệu ứng
		easing: PropTypes.oneOfType([ // hiệu ứng
			PropTypes.string,
			PropTypes.func
		]),
		style: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.object
		]),
		children: PropTypes.oneOfType([ // nội dung
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element)
		])
	};

	static defaultProps = {
		align: 'top',
		collapsed: true,
		collapsedHeight: 0,
		duration: 300,
		easing: 'easeOutCubic'
	};
	constructor(props) {
		super(props);

		this.state = {
			measuring: false
		};

		this._height = new Animated.Value(props.collapsedHeight);
		this._contentHeight = 0;
		this._animating = false;
		this._measured = false;
		this._easing = this._getEasing(this.props.easing);
		this._collapsed = props.collapsed;
	}

	toggle() {

		this._collapsed = !this._collapsed;
		return this._toggleCollapsed(this._collapsed);
	}

	hide() {

		this._collapsed = true;
		return this._toggleCollapsed(this._collapsed);
	}

	show() {

		this._collapsed = false;
		return this._toggleCollapsed(this._collapsed);
	}

	isCollapsed() {

		return this._collapsed;
	}

	componentWillReceiveProps(nextProps) {

		if (this.props.easing !== nextProps.easing) {

			this._easing = this._getEasing(nextProps.easing);
		}

		if (nextProps.collapsed !== this._collapsed) {

			this.toggle();
		} else if (nextProps.collapsed && nextProps.collapsedHeight !== this.props.collapsedHeight) {

			this._height.setValue(nextProps.collapsedHeight);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		return (
			this.state.measuring !== nextState.measuring ||
			this._collapsed !== nextProps.collapsed ||
			this.props.align !== nextProps.align ||
			this.props.collapsedHeight !== nextProps.collapsedHeight ||
			this.props.duration !== nextProps.duration ||
			this.props.children !== nextProps.children ||
			this.props.style != nextProps.style
		);
	}

	_getEasing(easing: String) {

		if (typeof easing === 'string') {

			let prefix;

			for (let i = 0; i < ANIMATED_EASING_PREFIXES.length; i++) {

				prefix = ANIMATED_EASING_PREFIXES[i];

				if (easing.substr(0, prefix.length) === prefix) {

					easing = easing.substr(prefix.length, 1).toLowerCase() + easing.substr(prefix.length + 1);
					prefix = prefix.substr(4, 1).toLowerCase() + prefix.substr(5);
					easing = Easing[prefix] && Easing[prefix](Easing[easing || 'ease']);

					break;
				}
			}
		}

		if (typeof easing !== "function") {

			throw new Error('Invalid easing type "' + this.props.easing + '"');
		}

		return easing;
	}

	_transitionToHeight(height: Number, callBack: Function) {

		this._height.stopAnimation();

		this._animating = true;
		Animated.timing(this._height, {

			toValue: height,
			duration: this.props.duration,
			easing: this._easing
		}).start(callBack);
	}

	_toggleCollapsed(collapsed: Boolean) {

		return new Promise((resolve, reject) => {

			if (collapsed) {

				this._transitionToHeight(this.props.collapsedHeight, e => {

					this._animating = false;
					resolve(e, this._collapsed);
				});
			} else if (!this.refs.content) {

				if (this._measured) {

					this._transitionToHeight(this._contentHeight, e => {

						this._animating = false;
						resolve(e, this._collapsed);
					});
				}
			} else {
				this._measureContent(contentHeight => this._transitionToHeight(contentHeight, e => {

					this._animating = false;
					resolve(e, this._collapsed);
				}));
			}
		});
	}

	_measureContent(callBack: Function) {

		this.setState(
			{ measuring: true },
			() => requestAnimationFrame(() => {

				if (!this.refs.content) {

					this.setState({
						measuring: false
					}, () => callBack(this.props.collapsedHeight));
				} else {

					this.refs.content.getNode().measure((x, y, width, height) => {

						this._contentHeight = height || this._contentHeight;
						this._measured = true;

						this.setState({
							measuring: false
						}, () => callBack(this._contentHeight));
					});
				}
			})
		);
	}

	_handleLayoutChange(event) {

		const contentHeight = event.nativeEvent.layout.height;

		if (this._animating || this._collapsed || this.state.measuring || this._contentHeight === contentHeight) {
			return;
		}

		this._height.stopAnimation();
		this._height.setValue(contentHeight);
		this._contentHeight = contentHeight;
	}

	render() {

		const {
			style,
			align,
			children
		} = this.props;

		const hasKnownHeight = !this.state.measuring && (this._measured || this._collapsed);

		const animStyle = hasKnownHeight && {
			overflow: 'hidden',
			height: this._height
		};

		const contentStyle = {};

		if (this.state.measuring) {

			contentStyle.position = 'absolute';
			contentStyle.opacity = 0;
		} else if (align === 'center') {

			contentStyle.transform = [{

				translateY: this._height.interpolate({

					inputRange: [0, this._contentHeight],
					outputRange: [this._contentHeight / -2, 0]
				})
			}];
		} else if (align === 'bottom') {

			contentStyle.transform = [{

				translateY: this._height.interpolate({

					inputRange: [0, this._contentHeight],
					outputRange: [-this._contentHeight, 0]
				})
			}];
		}

		return (
			<Animated.View
				style={animStyle}
				pointerEvents={this._collapsed ? 'none' : 'auto'}
			>
				<Animated.View
					ref="content"
					style={[(Array.isArray(style) ? mergeStyle(style) : style), contentStyle]}
					onLayout={this._handleLayoutChange.bind(this)}
				>
					{children}
				</Animated.View>
			</Animated.View>
		);
	}

	componentWillUnmount() {

		this._height.stopAnimation();
	}
}

export default Collapsible;