import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { TabRouter, createNavigator, createNavigationContainer, DrawerView } from 'react-navigation';
// import DrawerView from './components/DrawerView';
import addNavigationHelpers from './addNavigationHelpers';
// import DrawerContent from './components/DrawerContent';

/**
 * @todo Custom DrawerNavigator
 * @description mục đích trỏ Transitioner về custom Transitioner
 * @see react-navigation version 1.2.1
 * @author Croco
 * @since 28-2-2018
 * @param routeConfigMap: Object map route
 * @param stackConfig: config
 * @param Transitioner: component Transitioner
 */
export default ( routeConfigMap, configs = {} ) => {

	const {
		drawerWidth = () => {
			/*
			 * Default drawer width is screen width - header height
			 * with a max width of 280 on mobile and 320 on tablet
			 * https://material.io/guidelines/patterns/navigation-drawer.html
			 */
			const { height, width } = Dimensions.get('window');
			const smallerAxisSize = Math.min(height, width);
			const isLandscape = width > height;
			const isTablet = smallerAxisSize >= 600;
			const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
			const maxWidth = isTablet ? 320 : 280;

			return Math.min(smallerAxisSize - appBarHeight, maxWidth);
		},
		contentComponent =  require('./components/DrawerContent').default,
		drawerOpenRoute = 'DrawerOpen',
		drawerCloseRoute = 'DrawerClose',
		drawerToggleRoute = 'DrawerToggle',
		drawerPosition = 'left',
		drawerBackgroundColor = 'white',
		useNativeAnimations = true,
		containerConfig,
		drawerLockMode,
		contentOptions,
		
		headerTransitionPreset,
		mode = "card",
		headerMode = "screen",
		transitionConfig,
		onTransitionStart,
		onTransitionEnd,
		initialRouteName,
		initialRouteParams = {},
		paths,
		navigationOptions,
		lazy = false,
		onlyActive = false,
		order, // ?: string[]; // todo: type these as the real route names rather than 'string'
		backBehavior // ?: 'none' | 'initialRoute'; // defaults `initialRoute`
	} = configs;

	const contentRouter = TabRouter(routeConfigMap, {
		initialRouteName,
		paths,
		initialRouteParams,
		navigationOptions,
		order,
		backBehavior
	} );

	const contentNavigation = createNavigator( contentRouter, routeConfigMap, configs)( props => {

		const { router, navigation } = props;
		const { state: { routes, index }, dispatch } = navigation;

		const Component = router.getComponentForRouteName( routes[index].routeName );

		return (
			<Component 
				{ ...props }
				navigation 				= {
					addNavigationHelpers({
						dispatch,
						state: routes[index],
					})
				}
				headerMode={headerMode}
				headerTransitionPreset={headerTransitionPreset}
				mode={mode}
				cardStyle={cardStyle}
				transitionConfig={transitionConfig}
				onTransitionStart={onTransitionStart}
				lazy={lazy}
				onlyActive={onlyActive}
				footerMode={footerMode}
				onTransitionEnd={(lastTransition, transition) => {
					const { state: { key } = {}, dispatch } = props.navigation;
					dispatch(NavigationActions.completeTransition({ key }));
					onTransitionEnd && onTransitionEnd();
				}}
			/>
		);
	} );

	const drawerRouter = TabRouter(
		{
			[drawerCloseRoute]: { screen: contentNavigation },
			[drawerOpenRoute]: { screen: () => null },
			[drawerToggleRoute]: { screen: () => null }
		},
		{
			initialRouteName: drawerCloseRoute
		}
	);

	const drawerNavigation = createNavigator( drawerRouter, routeConfigMap, configs) ( props => {

		return (
			<DrawerView 
				{ ...props }
				headerMode 			= { headerMode }
				mode 				= { mode }
				transitionConfig 	= { transitionConfig }
				onTransitionStart 	= { onTransitionStart }
				onTransitionEnd 	= { onTransitionEnd }
				drawerWidth 		= { drawerWidth }
				contentComponent 	= { contentComponent }
				drawerPosition 		= { drawerPosition }
				lazy 				= { lazy }
				onlyActive 			= { onlyActive }
				footerMode 			= { footerMode }

				drawerBackgroundColor = {drawerBackgroundColor}
				drawerLockMode        = {drawerLockMode}
				useNativeAnimations   = {useNativeAnimations}
				contentOptions        = {contentOptions}
				drawerOpenRoute       = {drawerOpenRoute}
				drawerCloseRoute      = {drawerCloseRoute}
				drawerToggleRoute     = {drawerToggleRoute}
			/>
		);
	} );

	drawerNavigation.router = drawerRouter;
	return createNavigationContainer(drawerNavigation);
};