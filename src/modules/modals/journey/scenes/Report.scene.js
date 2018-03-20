"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Animated } from 'react-native';
import MapView from '~/components/MapView';
import NavigationBar from '../components/NavigationBar';
import Interactable from 'react-native-interactable';

class Report extends React.Component {

    static displayName = "@Report";

    static navigationOptions = {
        headerMode: "none"
    };

    constructor(props) {
        super(props);

        this._deltaY = new Animated.Value(0);
    }

    render() {

        return (
            <View style={_styles.container}>
                <MapView 
                    searchBar = {true}
                    showsUserLocation = {true}
                    followsUserLocation = {true}
                    showsMyLocationButton = {true}
                    style={_styles.mapView}
                />
                
                <Interactable.View
                    style = {{
                        zIndex: 100
                    }}
                    snapPoints={[{ y: 0 }, {y: -150}]}
                    boundaries={{ top: -150 }}
                    dragEnabled = {true}
                    verticalOnly={true}
                    animatedValueY={this._deltaY}
                >
                    <View style={{
                        backgroundColor: "white",
                        zIndex: 1000
                    }}>
                        <NavigationBar style={{
                            height: 50,
                            backgroundColor: "red"
                        }}/>
                    </View>
                </Interactable.View>
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