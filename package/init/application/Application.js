import React from 'react';
import { View } from 'react-native';

class Application extends React.Component {

	render() {

		return (
			this.props.children
		);
	}
}

export default Application;