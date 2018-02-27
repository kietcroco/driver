"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { colors, fontSizes, sizes } from '~/configs/styles';

class LocationView extends React.PureComponent {

    static displayName = "@LocationView";

    static propTypes = {
    };

    static defaultProps = {
    };

    render() {

        return (
            <View style={_styles.container}>
                <Text numberOfLines={1} style={_styles.street}>122 Bến vân đồn</Text>
                <Text numberOfLines={1} style={_styles.address}>phường 9, quận 4, TP.HCM</Text>
            </View>
        );
    }
}

const _styles = {
    container: {
        flex: 1,
        borderBottomColor: colors.separatorBackgroundColor,
        borderBottomWidth: sizes.separatorHeight
    },
    street: {
        fontSize: fontSizes.normal,
        color: colors.textColor,
        width: "100%"
    },
    address: {
        fontSize: fontSizes.small,
        color: colors.textItalicColor,
        width: "100%"
    }
};

export default LocationView;