"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Icon from './Icon';
import LocationView from './LocationView';
import sizes from '~/configs/styles/sizes';

class LocationItem extends React.Component {

    static displayName = "@LocationItem";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor( props ) {
        super( props );

    }

    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return true;
    }

    render() {

        return (
            <View style={_style}>
                <Icon name="history"/>
                <LocationView />
            </View>
        );
    }
}

const _style = {
    flexDirection: "row",
    width: "100%",
    marginVertical: sizes.spacing
};

export default LocationItem;