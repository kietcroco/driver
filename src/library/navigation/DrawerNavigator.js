import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { TabRouter, createNavigator } from 'react-navigation';
import Drawer from './components/Drawer';
import addNavigationHelpers from './addNavigationHelpers';
import DrawerContent from './components/DrawerContent';

export default ( routeConfigMap, configs = {} ) => {

	const {
		headerMode = "screen",
		mode = "card",
		transitionConfig,
		onTransitionStart,
		onTransitionEnd,
		drawerWidth = Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64),
		contentComponent = DrawerContent,
		drawerPosition = "left",
		lazy = false,
		onlyActive = false,
		footerMode = "none"
	} = configs;

	const contentRouter = TabRouter( routeConfigMap, configs );
	const contentNavigation = createNavigator( contentRouter, routeConfigMap, configs, "TABS" )( props => {

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
				headerMode 				= { headerMode }
				mode 					= { mode }
				transitionConfig 		= { transitionConfig }
				onTransitionStart 		= { onTransitionStart }
				onTransitionEnd 		= { onTransitionEnd }
				lazy 					= { lazy }
				onlyActive 				= { onlyActive }
				footerMode 				= { footerMode }
			/>
		);
	} );

	const drawerRouter = TabRouter(
		{
			DrawerClose: { screen: contentNavigation },
			DrawerOpen: { screen: () => null }
		},
		{
			initialRouteName: 'DrawerClose'
		}
	);

	const drawerNavigation = createNavigator( drawerRouter, routeConfigMap, configs, "DRAWER" ) ( props => {

		return (
			<Drawer 
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
			/>
		);
	} );

	drawerNavigation.router = drawerRouter;
	return drawerNavigation;
};