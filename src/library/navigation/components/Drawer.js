/**
 * @flow
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { DrawerView } from 'react-navigation';

class Drawer extends React.Component {

	static displayName = "@Drawer";

	static propTypes = {
		navigation: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired,
		screenProps: PropTypes.object,
		drawerPosition: PropTypes.oneOf([ // hướng drawer
			"left",
			"right"
		]),
		drawerWidth: PropTypes.number // độ rộng drawer
	};

	static defaultProps = {
		drawerPosition: "left"
	};

	shouldComponentUpdate(nextProps) {

		const { 
			navigation: { state: { index: nextIndex } }, 
			drawerPosition: nextDrawerPosition, 
			drawerWidth: nextDrawerWidth,
			nextContentComponent
		} = nextProps;
		const { 
			navigation: { state: { index } },
			drawerPosition,
			drawerWidth,
			contentComponent
		} = this.props;

		return (
			index !== nextIndex ||
			drawerPosition !== nextDrawerPosition ||
			drawerWidth !== nextDrawerWidth ||
			contentComponent !== nextContentComponent
		);
	}

	render() {

		const { contentComponent, drawerPosition, drawerWidth, ...otherProps } = this.props;

		return (
			<DrawerView 
				{ ...otherProps }
				drawerWidth 		= { drawerWidth || Dimensions.get('window').width - 56 }
				contentComponent 	= { contentComponent }
				drawerPosition 		= { drawerPosition }
			/>
		);
	}
}

export default Drawer;