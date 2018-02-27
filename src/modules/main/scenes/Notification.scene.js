"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';

class Notification extends React.Component {

    static displayName = "@Notification";

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
            <View>
                <Text>Notification</Text>
                <TouchableOpacity onPress={() => {

                    this.props.navigation.navigate('/profile');
                }}>
                    <Text>profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {

                    this.props.navigation.goBack();
                }}>
                    <Text>back</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const _styles = {
};

export default Notification;