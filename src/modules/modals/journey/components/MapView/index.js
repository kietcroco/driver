"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import MapViewBase from 'react-native-maps';
import { initialRegion } from '~/configs/map';
import extendExports from '~/library/extendExports';
import OmniBox from './components/OmniBox';

class MapView extends React.Component {

    static displayName = "@MapView";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            region: initialRegion
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        const {
            style,
            ...otherProps
        } = this.props;

        return (
            <View style={_styles.container}>
                <OmniBox>sdfsdf sdfds sfk fjkhfjk s fhsdjkf sdhfjkhsdjkh fjkshdjkfh sjkdhfjkshdjkfhsjkdhfjkshjkfhsjkhf jk hskdfh ksjdhfkhskfhsshfkjshk shdfkshk</OmniBox>
                <MapViewBase
                    {...otherProps}
                    provider={MapViewBase.PROVIDER_GOOGLE}
                    style={_styles.mapView}
                    initialRegion={initialRegion}
                    region={this.state.region}
                ></MapViewBase>
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


export default MapView;
// extends all static
module.exports = extendExports(MapView, MapViewBase);