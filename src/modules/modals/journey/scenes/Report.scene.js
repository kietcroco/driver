"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import MapView from '../components/MapView';

class Report extends React.Component {

    static displayName = "@Report";

    static navigationOptions = {
        headerMode: "none"
    };

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <View style={_styles.container}>
                <MapView style={_styles.mapView}/>
            </View>
        );
    }
}

const _styles = {
    container: {
        flex: 1
    },
    mapView: {
        flex: 1
    }
};

export default Report;