"use strict";
import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import mergeStyle from '~/library/mergeStyle';
import { colors, scale, hitSlop } from '~/configs/styles';

class ArrowTranform extends React.Component {

	static displayName = '@ArrowTranform';

	static propTypes = {
		style: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.array
		]),
		dir: PropTypes.oneOf(['up','down']),
		duration: PropTypes.number, //Thời gian tranform
		disable: PropTypes.any, // cho phép click đổi chiều không
		onPress: PropTypes.func
	};

	static defaultProps = {
		dir: "down",
		duration: 300,
		disable: false
	};

	constructor(props) {
		super(props);

		this._radian = (props.dir == "up" ? 180 : 0);
		this._rotate = new Animated.Value( this._radian );
	}

	//Sự kiện đổi chiều mũi tên
	toggle(){

		this._transform( 180 - this._radian );
	}

	_transform( radian: Number = 0 ) {

		this._rotate.stopAnimation();

		Animated.timing(
			this._rotate,
			{ 
				toValue: radian,
				duration : this.props.duration
			}
		).start( () => {

			this._radian = radian;
		} );
	}

	componentWillReceiveProps(nextProps) {

		if( this.props.dir !== nextProps.dir ) {

			let radian = nextProps.dir == "up" ? 180 : 0;
			this._transform(radian);
		}
	}

	shouldComponentUpdate(nextProps) {

		return (
			this.props.disable !== nextProps.disable ||
			this.props.duration !== nextProps.duration ||
			this.props.dir !== nextProps.dir ||
			this.props.style != nextProps.style
		);
	}

	_renderIcon( style: Object ) {

		// góc
		const spinRotate = this._rotate.interpolate({
			inputRange: [0, 180],
			outputRange: ['0deg', '180deg']
		});

		const radian = (Math.PI / 180) * 180;

		// bù trừ x, y để canh giữa ( do transform rigin chưa được hỗ trợ )
		const translateX = this._rotate.interpolate({
			inputRange: [0, 180],
			outputRange: [0, Math.sin(radian)]
		});

		const translateY = this._rotate.interpolate({
			inputRange: [0, 180],
			outputRange: [0, Math.cos(radian)]
		});

		return (
			<Animated.View style={[
				{transform: [
					{translateX: translateX},
					{translateY: translateY},
					{rotate: spinRotate}
				]},
				_styles.container
			]}>
				<FAIcon name="angle-down" style={ style ? [_styles.icon, style] : _styles.icon }/>
			</Animated.View>
		);
	}

	render () {

		const { style, onPress, disable } = this.props;

		if( disable ) {

			return this._renderIcon( (Array.isArray(style) ? mergeStyle(style) : style) );
		}

		return (
			<TouchableOpacity
				onPress 		= { onPress ? e => {this.toggle(); onPress(e)} : () => this.toggle() }
				style 			= { _styles.container }
				hitSlop 		= { hitSlop }
			>
				{ this._renderIcon() }
			</TouchableOpacity>
		);
	}

	componentWillUnmount() {

		this._rotate.stopAnimation();
	}
}

const _styles = {
	container:{
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		fontSize: 20 * scale,
		color: colors.boldColor
	}
};

export default ArrowTranform;