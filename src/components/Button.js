"use strict";
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

/**
 * Button Component
 * @author duy.nguyen 24.02.2018
 */
class Button extends React.Component {

    static displayName = "@Button";

    static propTypes = {
        label: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.object
    };
    static defaultProps = {

    };
    render() {

        return (
            <TouchableOpacity
                style={[_styles.container, this.props.style]}
                onPress={this.props.onPress && this.props.onPress()}
            >
                <Text style={_styles.btnLabel}>{this.props.label}</Text>
            </TouchableOpacity>
        );
    }
}

const _styles = {
    container: {
        height: 45,
        width: 200,
        borderRadius: 45,
        backgroundColor: colors.headerBackgroundColor,
        alignItems: "center",
        justifyContent: "center"
    },
    btnLabel: {
        color: 'white'
    }
};

export default Button;