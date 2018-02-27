import React from 'react';
import { TabRouter, createNavigator } from 'react-navigation';
import SlideTransitioner from './components/SlideTransitioner';

export default ( routeConfigMap, configs = {}, Transitioner = SlideTransitioner ) => {

	const {
		headerMode = "screen",
		mode = "card",
		transitionConfig,
		onTransitionStart,
		onTransitionEnd,
		lazy = false,
		onlyActive = false,
		footerMode = "none"
	} = configs;

	const router = TabRouter( routeConfigMap, configs );
	const Navigation = createNavigator( router, routeConfigMap, configs, "TABS" )( props => {

		return (
			<Transitioner 
				{ ...props }
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

	Navigation.router = router;
	return Navigation;
};