import React from 'react';
import { StackRouter, createNavigator, NavigationActions, createNavigationContainer } from 'react-navigation';
// import ModalTransitioner from './components/ModalTransitioner';

/**
 * @todo Custom StackNavigator
 * @description mục đích trỏ Transitioner về custom Transitioner
 * @see react-navigation version 1.2.1
 * @author Croco
 * @since 28-2-2018
 * @param routeConfigMap: Object map route
 * @param stackConfig: config
 * @param Transitioner: component Transitioner
 */
export default (routeConfigMap, stackConfig = {}, Transitioner ) => {

	Transitioner = Transitioner || require('./components/ModalTransitioner').default;
	
	const {
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
	} = stackConfig;

	const router = StackRouter(routeConfigMap, {
		initialRouteName,
		paths,
		initialRouteParams,
		navigationOptions,
		order,
		backBehavior
	});

	const navigator = createNavigator(router, routeConfigMap, stackConfig)( props => {

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
				onTransitionEnd		   = {(lastTransition, transition) => {
					const { state: { key } = {}, dispatch } = props.navigation;
					dispatch(NavigationActions.completeTransition({ key }));
					onTransitionEnd && onTransitionEnd();
				}}
			/>
		);
	} );

	const prevGetStateForAction = router.getStateForAction;

	navigator.router = {
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

	return createNavigationContainer(navigator);
};