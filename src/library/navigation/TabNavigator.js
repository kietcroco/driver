import React from 'react';
import { TabRouter, createNavigator, NavigationActions, createNavigationContainer } from 'react-navigation';
// import SlideTransitioner from './components/SlideTransitioner';

/**
 * @todo Custom TabNavigator
 * @description mục đích trỏ Transitioner về custom Transitioner
 * @see react-navigation version 1.2.1
 * @author Croco
 * @since 28-2-2018
 * @param routeConfigMap: Object map route
 * @param config: config
 * @param Transitioner: component Transitioner
 */
export default ( routeConfigMap, configs = {}, Transitioner ) => {

	Transitioner = Transitioner || require('./components/SlideTransitioner').default;

	const {
		tabBarComponent,
		tabBarPosition = "bottom",
		tabBarOptions,
		removeClippedSubviews,
		swipeEnabled = false,
		animationEnabled = false,
		configureTransition,
		initialLayout,

		initialRouteName,
		initialRouteParams = {},
		paths,
		headerMode = "screen",
		headerTransitionPreset,
		mode = "card",
		cardStyle,
		transitionConfig,
		onTransitionStart,
		onTransitionEnd,
		navigationOptions,
		lazy = false,
		onlyActive = false,
		footerMode = "none",
		order, // ?: string[]; // todo: type these as the real route names rather than 'string'
		backBehavior // ?: 'none' | 'initialRoute'; // defaults `initialRoute`
	} = configs;

	const router = TabRouter(routeConfigMap, {
		initialRouteName,
		paths,
		initialRouteParams,
		navigationOptions,
		order,
		backBehavior
	} );

	const navigator = createNavigator( router, routeConfigMap, configs)( props => {

		return (
			<Transitioner
				{...props}
				headerMode             = {headerMode}
				headerTransitionPreset = {headerTransitionPreset}
				mode                   = {mode}
				cardStyle              = {cardStyle}
				transitionConfig       = {transitionConfig}
				onTransitionStart      = {onTransitionStart}
				lazy                   = {lazy}
				onlyActive             = {onlyActive}
				footerMode             = {footerMode}
				onTransitionEnd 	   = {(lastTransition, transition) => {
					const { state: { key } = {}, dispatch } = props.navigation;
					dispatch(NavigationActions.completeTransition({ key }));
					onTransitionEnd && onTransitionEnd();
				}}
				
				removeClippedSubviews  = {removeClippedSubviews}
				tabBarComponent        = {tabBarComponent}
				tabBarPosition         = {tabBarPosition}
				tabBarOptions          = {tabBarOptions}
				swipeEnabled           = {swipeEnabled}
				animationEnabled       = {animationEnabled}
				configureTransition    = {configureTransition}
				initialLayout          = {initialLayout}
			/>
		);
	} );

	navigator.router = router;
	return createNavigationContainer(navigator);
};