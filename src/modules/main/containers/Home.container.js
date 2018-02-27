import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Component from '../scenes/Home.scene';
import * as actions from '../actions/home.action';
import reducer from '../reducers/home.reducer';
import '../epics/home.epic';

const key = reducer.typeOf();

const mapStateToProps = state => {

	return {
		reducers: state[key]
	};
};

const mapDispatchToProps = dispatch => {

	return {
		dispatch,
		actions: bindActionCreators(actions, dispatch)
	};
};

// const mergeProps = () => {

// };

const options = {
	withRef: true,
	pure: false
};
export default connect(mapStateToProps, mapDispatchToProps, null, options)(Component);