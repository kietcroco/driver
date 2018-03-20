"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { colors, scale, shadow } from '~/configs/styles';
import getCurrentPosition from '../utils/getCurrentPosition';

class CurrentLocationButton extends React.PureComponent {

    static displayName = "@CurrentLocationButton";

    static propTypes = {
        onCurrentPosition: PropTypes.func,
        currentPosition: PropTypes.object
    };

    static defaultProps = {
        activeOpacity: colors.activeOpacity
    };

    render() {

        const {
            style,
            ...otherProps
        } = this.props;

        return (
            <TouchableOpacity
                {...otherProps}
                activeOpacity = {colors.activeOpacity}
                onPress       = {this._onPress}
                style         = {[_styles.container, style]}
            >
                <MtIcon name="my-location" style={_styles.iconLocation} />
            </TouchableOpacity>
        );
    }

    _onPress = async (e) => {

        this.props.onPress && this.props.onPress(e);

        if (!this.props.onCurrentPosition) {
            return;
        }

        if (this.props.currentPosition) {

            return this.props.onCurrentPosition( this.props.currentPosition );
        }

        try {

            let position = await getCurrentPosition();
            if ( position && position.coords ) {

                position = position.coords;
                this.props.onCurrentPosition(position);
            }
        } catch (error) { }
    };
}

const _styles = {
    container: {
        position: "absolute",
        bottom: 10 * scale,
        right: 10 * scale,
        backgroundColor: colors.primaryBackgroundColor,
        width: 60 * scale,
        height: 60 * scale,
        borderRadius: 30 * scale,
        justifyContent: "center",
        alignItems: "center",
        ...shadow
    },
    iconLocation: {
        color: colors.textBoldColor,
        fontSize: 22
    }
};

export default CurrentLocationButton;