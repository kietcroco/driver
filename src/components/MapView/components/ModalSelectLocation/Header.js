"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { colors, scale, fontSizes } from '~/configs/styles';

class Header extends React.PureComponent {

    static displayName = "@Header";

    static propTypes = {
        backOnPress: PropTypes.func,
        submitOnPress: PropTypes.func
    };

    render() {

        return (
            <View style={_styles.container}>
                <TouchableOpacity onPress={ this.props.backOnPress } style={_styles.btn} activeOpacity={colors.activeOpacity}>
                    <MtIcon name='arrow-back' style={_styles.iconBack} />
                </TouchableOpacity>
                <View style={_styles.titleBox}>
                    <Text style={_styles.title}>{translate("maps.select_location_on_map")}</Text>
                    <Text style={_styles.description}>{translate("maps.select_location_on_map_description")}</Text>
                </View>
                <TouchableOpacity onPress={ this.props.submitOnPress } style={_styles.btn} activeOpacity={colors.activeOpacity}>
                    <Text style={_styles.lblOk}>{translate("maps.select_location_on_map_submit")}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const _styles = {
    container: {
        backgroundColor: colors.headerBackgroundColor,
        flexDirection: "row",
        height: 60 * scale
    },
    btn: {
        height: "100%",
        width: 60 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    titleBox: {
        flex: 1,
        justifyContent: "center",
        height: "100%"
    },
    iconBack: {
        fontSize: 30 * scale,
        color: colors.textSinkingColor
    },
    lblOk: {
        color: colors.textSinkingColor,
        fontSize: 20 * scale,
        fontWeight: "bold"
    },
    title: {
        fontSize: fontSizes.large,
        color: colors.textSinkingColor
    },
    description: {
        fontSize: fontSizes.small,
        color: colors.textSinkingColor
    }
};

export default Header;