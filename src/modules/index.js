/**
 * @flow
*/
import React from 'react';
import { connect } from 'react-redux';
import Navigation from './navigation';
import addNavigationHelpers from '~/library/navigation/addNavigationHelpers';
import shallowEqual from 'fbjs/lib/shallowEqual';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

// key reducer
const reducerKey = "$$navigation";

// component navigation
class Navigator extends React.Component {

	static displayName = reducerKey;

	shouldComponentUpdate(nextProps) {

		return (
			!shallowEqual(this.props.navigationState, nextProps.navigationState) ||
			!shallowEqual(this.props.screenProps, nextProps.screenProps) ||
			!shallowEqual(this.props, nextProps)
		);
	}

	render() {

		const { navigationState, dispatch, ...otherProps } = this.props;

		// event navigation
		const addListener = createReduxBoundAddListener(reducerKey);

		const navigation = addNavigationHelpers({
			dispatch,
			state: navigationState,
			addListener
		});

		return (
			<Navigation { ...otherProps } navigation={ navigation }/>
		);
	}
}

// đăng ký redux
ReducerRegistry.register( reducerKey, ( state, action ) => {
	
	return Navigation.router.getStateForAction(action, state) || state;
}, true);

// map state
export default connect( state => ({

	navigationState: state[ reducerKey ]
}) )( Navigator );