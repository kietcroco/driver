import React from 'react';
import { StackRouter, createNavigator, NavigationActions } from 'react-navigation';
import ModalTransitioner from './components/ModalTransitioner';

export default ( routeConfigMap, configs = {}, Transitioner = ModalTransitioner ) => {

	const {
		headerMode = "screen",
		mode = "card",
		cardStyle,
		transitionConfig,
		onTransitionStart,
		onTransitionEnd,
		lazy = false,
		onlyActive = false,
		footerMode = "none"
	} = configs;

	const router = StackRouter( routeConfigMap, configs );

	const Navigation = createNavigator( router, routeConfigMap, configs, "STACK" )( props => {

		return (
			<Transitioner 
				{ ...props }
				headerMode 				= { headerMode }
				mode 					= { mode }
				cardStyle 				= { cardStyle }
				transitionConfig 		= { transitionConfig }
				onTransitionStart 		= { onTransitionStart }
				onTransitionEnd 		= { onTransitionEnd }
				lazy 					= { lazy }
				onlyActive 				= { onlyActive }
				footerMode 				= { footerMode }
			/>
		);
	} );

	const prevGetStateForAction = router.getStateForAction;

	Navigation.router = {
		...router,
		getStateForAction: ( action, state ) => {

			if( state && action.type === "Navigation/REPLACE" ) {

				action.type = NavigationActions.NAVIGATE
				const numReplace = action.replaceNum || 1;
				const routes = state.routes.slice(0, state.routes.length - numReplace);
				// routes.push( {
				// 	...action,
				// 	key: `scene_${ (new Date()).getTime() }`
				// } );

				state =  {
					...state,
					routes,
					index: routes.length - 1
				};
				//return prevGetStateForAction(action, state);
			}
			
			return prevGetStateForAction( action, state );
		}
	};

	return Navigation;
};