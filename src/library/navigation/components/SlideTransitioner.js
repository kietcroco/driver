/**
 * @flow
*/
import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Easing, Dimensions } from 'react-native';
import { Transitioner } from 'react-navigation';
import { isReactComponent, isElement } from '~/library/componentDetect';
import shallowEqual from 'fbjs/lib/shallowEqual';
import addNavigationHelpers from '../addNavigationHelpers';
import getChildEventSubscriber from 'react-navigation/src/getChildEventSubscriber';

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
		onlyActive: PropTypes.bool,
		headerTransitionPreset: PropTypes.string,
		footerTransitionPreset: PropTypes.string,
		transitionConfig: PropTypes.func
	};

	static defaultProps = {
		headerMode: "screen",
		footerMode: "none",
		lazy: false,
		onlyActive: false,
		headerTransitionPreset: "fade-in-place",
		footerTransitionPreset: "fade-in-place"
	};

	constructor( props ) {
		super(props);

		this._screenDetails = {};
		this._loaded = [];
	}

	componentWillReceiveProps(props) {

		if (props.screenProps !== this.props.screenProps) {

			this._screenDetails = {};
		}
	}

	shouldComponentUpdate(nextProps) {

		return (
			!shallowEqual( this.props.navigation.state, nextProps.navigation.state ) ||
			!shallowEqual( this.props.screenProps, nextProps.screenProps ) ||
			!shallowEqual(this.props, nextProps)
		);
	}

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
	 * @todo hàm render ra các màn hình
	 * @author Croco
	 * @since 28-2-2018
	 */
	_render = (props, prevProps) => {

		// remove các state cũ
		props.scenes.forEach(newScene => {

			if (
				this._screenDetails[newScene.key] &&
				this._screenDetails[newScene.key].state !== newScene.route
			) {

				this._screenDetails[newScene.key] = null;
			}
		});

		// remove các route không còn trong lịch sử
		this._loaded = this._loaded.filter(key => {

			return props.scenes.includes(key);
		});

		const {
			onlyActive,
			lazy,
			headerMode,
			footerMode
		} = this.props;

		const transitionConfigs = this._getTransitionConfig();

		props = {
			...props,
			transitionConfigs
		};

		let scenes = null;

		// cache
		if (this._loaded.indexOf(props.scene.key) === -1) {

			this._loaded.push(props.scene.key);
		}

		// only display scene
		if (onlyActive) {

			scenes = this._renderScene(props, props.scene);
		} else if (lazy) { // lazy display scene

			scenes = props.scenes.map(scene => {

				if (this._loaded.indexOf(scene.key) !== -1) {

					return this._renderScene(props, scene);
				}

				return null;
			});
		} else { // all display scene

			scenes = props.scenes.map(scene => {

				return this._renderScene(props, scene);
			});
		}

		let floatHeader = null;
		let floatFooter = null;

		if (headerMode !== "none" && headerMode === "float") {

			floatHeader = this._renderHeader(props, props.scene, headerMode);
		}

		if (footerMode !== "none" && footerMode === "float") {

			floatFooter = this._renderFooter(props, props.scene, footerMode);
		}

		return (
			<View style={_styles.wrapper}>
				{floatHeader}
				<View style={_styles.scene}>
					{scenes}
				</View>
				{floatFooter}
			</View>
		);
	};

	/**
	 * @todo: Hàm render màn hình
	 * @author: Croco
	 * @since: 28-2-2018
	*/
	_renderScene = (transitionProps, scene) => {

		// config style
		const { transitionConfigs: { screenInterpolator } } = transitionProps;
		const style = screenInterpolator && screenInterpolator({ ...transitionProps, scene });

		const {
			screenProps,
			headerMode,
			footerMode,
			mode,
			cardStyle,
			router,
			pointerEvents,
			onComponentRef
		} = this.props;

		// lấy component theo route name
		const SceneComponent = router.getComponentForRouteName(scene.route.routeName);

		// lấy navigation
		const { navigation } = this._getScreenDetails(scene, transitionProps);

		return (
			<Animated.View
				pointerEvents = {pointerEvents}
				style         = {[_styles.container, cardStyle, style]}
				key           = {scene.key}
				ref           = {onComponentRef}
			>
				{(headerMode === "screen" || mode === "modal") && this._renderHeader(transitionProps, scene, headerMode)}
				<SceneComponent navigation={navigation} screenProps={screenProps} />
				{(footerMode === "screen" || mode === "modal") && this._renderFooter(transitionProps, scene, footerMode)}
			</Animated.View>
		);
	};

	/**
	 * @todo hàm render header
	 * @author Croco
	 * @since 28-2-2018
	 */
	_renderHeader = (transitionProps, scene, headerMode) => {

		if (headerMode === "none") return null;

		const { header: Header, headerMode: headerModeOption } = this._getScreenDetails(scene, transitionProps).options;

		if (headerModeOption === "none") return null;
		headerMode = headerModeOption;

		const {
			transitionConfigs,
			...otherTransitionProps
		} = transitionProps;

		const {
			headerLeftInterpolator,
			headerTitleInterpolator,
			headerRightInterpolator,
		} = transitionConfigs;

		const {
			transitionConfig,
			cardStyle,
			headerTransitionPreset,
			onlyActive,
			lazy,
			...passProps
		} = this.props;

		const props = {
			...passProps,
			...otherTransitionProps,
			scene,
			mode: headerMode,
			transitionPreset: headerTransitionPreset,
			getScreenDetails: scene => this._getScreenDetails(scene, transitionProps),
			leftInterpolator: headerLeftInterpolator,
			titleInterpolator: headerTitleInterpolator,
			rightInterpolator: headerRightInterpolator
		};

		// nếu là component
		if (isReactComponent(Header)) {

			return (
				<Header {...props} />
			);
		}

		// nếu là node
		if (isElement(Header)) {

			return (Header);
		}

		// nếu là stateless component
		if (typeof Header === 'function') {

			return Header({
				...props
			});
		}

		return null;
	};

	/**
	 * @todo hàm render footer
	 * @author Croco
	 * @since 28-2-2018
	 */
	_renderFooter = (transitionProps, scene, footerMode) => {

		if (footerMode === "none") return null;

		const { footer: Footer, footerMode: footerModeOption } = this._getScreenDetails(scene, transitionProps).options;

		if (footerModeOption === "none") return null;
		footerMode = footerModeOption;

		const {
			transitionConfigs,
			...otherTransitionProps
		} = transitionProps;

		const {
			footerLeftInterpolator,
			footerRightInterpolator,
		} = transitionConfigs;

		const {
			transitionConfig,
			cardStyle,
			footerTransitionPreset,
			onlyActive,
			lazy,
			...passProps
		} = this.props;

		const props = {
			...passProps,
			...otherTransitionProps,
			scene,
			mode: footerMode,
			transitionPreset: footerTransitionPreset,
			getScreenDetails: scene => this._getScreenDetails(scene, transitionProps),
			leftInterpolator: footerLeftInterpolator,
			rightInterpolator: footerRightInterpolator
		};

		// nếu là component
		if (isReactComponent(Footer)) {

			return (
				<Footer {...props} />
			);
		}

		// nếu là node
		if (isElement(Footer)) {

			return (Footer);
		}

		// nếu là stateless component
		if (typeof Footer === 'function') {

			return Footer({
				...props
			});
		}

		return null;
	};

	/**
	 * @todo hàm xử lý navigation
	 * @author Croco
	 * @since 28-2-2018
	 * @param scene: màn hình hiện tại
	 */
	_getScreenDetails = (scene, _props) => {

		const { screenProps, router } = this.props;

		const {
			navigation
		} = _props || this.props;

		let screenDetails = this._screenDetails[scene.key];

		if (!screenDetails || screenDetails.state !== scene.route) {

			const screenNavigation = addNavigationHelpers({
				...navigation,
				state: scene.route,
				addListener: getChildEventSubscriber(
					navigation.addListener || function(){},
					scene.route.key
				)
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

	/**
	 * @todo: Hàm config hiệu ứng
	 * @author: Croco
	 * @since: 17-5-2017
	*/
	_configureTransition = (transitionProps, prevTransitionProps) => {

		return this._getTransitionConfig().transitionSpec;
	};

	/**
	 * @todo: Hàm config Transition
	 * @author: Croco
	 * @since: 28-2-2018
	*/
	_getTransitionConfig = () => {

		if (typeof this.props.transitionConfig === "function") {

			return {
				transitionSpec,
				screenInterpolator,
				...this.props.transitionConfig(transitionProps, prevTransitionProps, this.props.mode === 'modal')
			};
		}
		return {
			transitionSpec,
			screenInterpolator
		};
	};
}

const transitionSpec = {
	timing: Animated.timing,
	duration: 200,
	easing: Easing.inOut(Easing.ease),
	useNativeDriver: false
};

const screenInterpolator = (props) => {

	const { position, scene } = props;
	const { index } = scene;

	const WIDTH = Dimensions.get('window').width;

	const translateX = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [WIDTH, 0, -WIDTH]
	});

	return {
		transform: [
			{ translateX }
		]
	};
};

const _styles = {
	wrapper: {
		flex: 1,
		position: "relative",
		flexDirection: 'column'
	},
	scene: {
		flex: 1,
		backgroundColor: "white",
		position: "relative"
	},
	container: {
		backgroundColor: "white",
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