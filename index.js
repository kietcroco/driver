import React from 'react';
import createApplication from '~/package/init/application/createApplication';
import { AppRegistry, View } from 'react-native';

class Abc extends React.Component {

	render(){

		return (
			<View style={{
				flex: 1,
				backgroundColor: "red"
			}}/>
		);
	}
}

const Application = createApplication( () => Abc, {
	
} );
AppRegistry.registerComponent('ITVINADriver', Application);