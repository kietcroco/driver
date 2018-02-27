/**
 * @flow
*/
import React from 'react';
import { connect } from 'react-redux';
import Navigation from './navigation';
// import recursiveShallowEqual from '~/library/recursiveShallowEqual';
import addNavigationHelpers from '~/library/navigation/addNavigationHelpers';
import shallowEqual from 'fbjs/lib/shallowEqual';

// key reducer
const reducerKey = "$$navigation";

// component navigation
class Navigator extends React.Component {

	static displayName = reducerKey;

	shouldComponentUpdate(nextProps) {

		return (
			!shallowEqual(this.props.screenProps, nextProps.screenProps) ||
			!shallowEqual(this.props.navigationState, nextProps.navigationState) ||
			!shallowEqual(this.props, nextProps)
		);
		// return (
		// 	recursiveShallowEqual( this.props.screenProps, nextProps.screenProps ) ||
		// 	recursiveShallowEqual( this.props.navigationState, nextProps.navigationState )
		// );
	}

	render() {

		const { navigationState, dispatch, ...otherProps } = this.props;

		const navigation = addNavigationHelpers({
			dispatch,
			state: navigationState
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