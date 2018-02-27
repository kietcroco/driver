/**
 * @flow
*/
import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Easing, Dimensions } from 'react-native';
import { Transitioner } from 'react-navigation';
//import recursiveShallowEqual from '~/library/recursiveShallowEqual';
import { isReactComponent, isElement } from '~/library/componentDetect';
import shallowEqual from 'fbjs/lib/shallowEqual';
import addNavigationHelpers from '../addNavigationHelpers';

class SlideTransitioner extends React.Component {

	static displayName = "@SlideTransitioner";

	static propTypes = {
		navigation: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired,
		screenProps: PropTypes.object,
		headerMode: PropTypes.oneOf([
			"none",
			"float",
			"screen"
		]),
		footerMode: PropTypes.oneOf([
			"none",
			"float",
			"screen"
		]),
		lazy: PropTypes.bool,
		onlyActive: PropTypes.bool
	};

	static defaultProps = {
		headerMode: "screen",
		footerMode: "none",
		lazy: false,
		onlyActive: false
	};

	constructor( props ) {
		super(props);

		this._screenDetails = {};
		this._loaded = [];
	}

	componentWillReceiveProps(props: Props) {

		if (props.screenProps !== this.props.screenProps) {

			this._screenDetails = {};
		}
	}

	shouldComponentUpdate(nextProps) {

		return (
			// this.props.headerMode !== nextProps.headerMode ||
			// this.props.lazy !== nextProps.lazy ||
			// this.props.onlyActive !== nextProps.onlyActive ||
			// this.props.footerMode !== nextProps.footerMode ||
			// this.props.mode !== nextProps.mode ||
			!shallowEqual( this.props.screenProps, nextProps.screenProps ) ||
			!shallowEqual( this.props.navigation.state, nextProps.navigation.state ) ||
			!shallowEqual(this.props, nextProps)
			//!recursiveShallowEqual( this.props.transitionConfig, nextProps.transitionConfig )
		);
	}

	/**
	 * @todo: Hàm tạo hiệu ứng các màn hình trước và sau khi chuyển
	 * @author: Croco
	 * @since: 17-5-2017
	*/
	_renderScene = ( transitionProps, scene ) => {

		const { position } = transitionProps;
		const { index } = scene;

		const WIDTH = Dimensions.get('window').width;
		
		const translateX = position.interpolate({
			inputRange: [index - 1, index, index + 1],
			outputRange: [WIDTH, 0, -WIDTH]
		});

		const SceneComponent = this.props.router.getComponentForRouteName( scene.route.routeName );

		const { navigation } = this._getScreenDetails(scene);
		const { screenProps, headerMode, cardStyle, footerMode } = this.props;
		
		return (
			<Animated.View style={[ _styles.container, cardStyle, {transform: [{ translateX }]}]} key={scene.key}>
				{ headerMode !== "float" && this._renderHeader(scene, headerMode) }
				<SceneComponent navigation={ navigation } screenProps={ screenProps } />
				{ footerMode !== "float" && this._renderFooter(scene, footerMode) }
			</Animated.View>
		);
	};

	_renderHeader = ( scene, headerMode ) => {

		if( headerMode === "none" ) return null;

		const { header: Header, headerMode: headerModeOption } = this._getScreenDetails(scene).options;

		if (headerModeOption === "none" ) return null;
		headerMode = headerModeOption;

		if ( isReactComponent( Header ) ) {

			return (
				<Header 
					{ ...this.props }
					scene 				= { scene }
					mode 				= { headerMode }
					getScreenDetails 	= { this._getScreenDetails }
				/>
			);
		}

		if( isElement( Header ) ) {

			return ( Header );
		}

		if( typeof Header === 'function' ) {

			return Header({
				...this.props,
				scene: scene,
				mode: headerMode,
				getScreenDetails: this._getScreenDetails
			});
		}

		return null;
	};

	_renderFooter = ( scene, footerMode ) => {

		if( footerMode === "none" ) return null;

		const { footer: Footer, footerMode: footerModeOption } = this._getScreenDetails(scene).options;

		if (footerModeOption === "none") return null;
		footerMode = footerModeOption;

		if ( isReactComponent( Footer ) ) {

			return (
				<Footer 
					{ ...this.props }
					scene 				= { scene }
					mode 				= { footerMode }
					getScreenDetails 	= { this._getScreenDetails }
				/>
			);
		}

		if( isElement( Footer ) ) {

			return ( Footer );
		}

		if( typeof Footer === 'function' ) {

			return Footer({
				...this.props,
				scene: scene,
				mode: footerMode,
				getScreenDetails: this._getScreenDetails
			});
		}

		return null;
	};

	_render = ( transitionProps ) => {

		transitionProps.scenes.forEach( newScene => {

			if (
				this._screenDetails[newScene.key] &&
				this._screenDetails[newScene.key].state !== newScene.route
				) {

				this._screenDetails[newScene.key] = null;
			}
		});

		var scenes = null;

		if( this.props.onlyActive ) {

			scenes = this._renderScene(transitionProps, transitionProps.scene);
		} else if( this.props.lazy ) {

			if( this._loaded.indexOf( transitionProps.scene.index ) === -1 ) {

				this._loaded.push( transitionProps.scene.index );
			}

			scenes = transitionProps.scenes.map(scene => {

				if( this._loaded.indexOf( scene.index ) !== -1 ) {

					return this._renderScene(transitionProps, scene);
				}
				
				return null;
			});
		} else {

			scenes = transitionProps.scenes.map(scene => {

				return this._renderScene(transitionProps, scene);
			});
		}

		let floatHeader = null;
		let floatFooter = null;

		if( this.props.headerMode !== "none" && this.props.headerMode === "float" ) {

			floatHeader = this._renderHeader( transitionProps.scene, this.props.headerMode );
		}
		
		if( this.props.footerMode !== "none" && this.props.footerMode === "float" ) {

			floatFooter = this._renderFooter( transitionProps.scene, this.props.footerMode );
		}

		return (
			<View style={ _styles.wrapper }>
				{ floatHeader }
				<View style={ _styles.scene }>
					{ scenes }
				</View>
				{ floatFooter }
			</View>
		);
	};

	render() {

		return (
			<Transitioner
				configureTransition 	= {this._configureTransition}
				navigation 				= {this.props.navigation}
				render 					= {this._render}
				onTransitionStart 		= {this.props.onTransitionStart}
				onTransitionEnd 		= {this.props.onTransitionEnd}
			/>
		);
	}

	/**
	 * @todo: Hàm config hiệu ứng
	 * @author: Croco
	 * @since: 17-5-2017
	*/
	_configureTransition = (transitionProps, prevTransitionProps) => {

		return {
			timing: Animated.timing,
			duration: 200,
			easing: Easing.inOut(Easing.ease)
		};
	};

	_getScreenDetails = (scene) => {
		const { screenProps, navigation, router } = this.props;

		let screenDetails = this._screenDetails[scene.key];

		if (!screenDetails || screenDetails.state !== scene.route) {

			const screenNavigation = addNavigationHelpers({
				...navigation,
				state: scene.route,
				scene
			});

			screenDetails = {
				state: scene.route,
				navigation: screenNavigation,
				options: router.getScreenOptions(screenNavigation, screenProps),
			};
			this._screenDetails[scene.key] = screenDetails;
		}
		return screenDetails;
	};
}

const _styles = {
	wrapper: {
		flex: 1,
		position: "relative",
		flexDirection: 'column'
	},
	scene: {
		flex: 1,
		position: "relative"
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}
};

export default SlideTransitioner;