"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { scale, colors, fontSizes, sizes } from '~/configs/styles';

class NavigationBar extends React.Component {

    static displayName = "@NavigationBar";

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
            <View style={_styles.container}>
                <TouchableOpacity style={_styles.button} activeOpacity={ colors.activeOpacity }>
                    <MtIcon style={_styles.icoClose} name="close"/>
                </TouchableOpacity>
                <View style={_styles.content}>
                    <Text style={_styles.txtVehicleName}>36B-00718</Text>
                    <View style={_styles.boxDescription}>
                        <Text style={_styles.txtDescription}>19 km</Text>
                        <Text style={_styles.txtDescription}>30 phút</Text>
                    </View>
                </View>
                <TouchableOpacity style={_styles.button} activeOpacity={colors.activeOpacity}>
                    <MtIcon style={_styles.icoShare} name="share" />
                </TouchableOpacity>
                <TouchableOpacity style={_styles.button}  activeOpacity={colors.activeOpacity}>
                    <MtIcon style={_styles.icoMenu} name="keyboard-arrow-up" />
                </TouchableOpacity>
            </View>
        );
    }
}

const _styles = {
    container: {
        height: sizes.footerHeight,
        flexDirection: "row"
    },
    button: {
        height: "100%",
        width: sizes.footerHeight,
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        flex: 1,
        justifyContent: "center"
    },
    icoClose: {
        fontSize: 30 * scale,
        color: colors.textBoldColor
    },
    icoShare: {
        fontSize: 25 * scale,
        color: colors.textBoldColor
    },
    icoMenu: {
        fontSize: 50 * scale,
        color: colors.textBoldColor
    },
    txtVehicleName: {
        fontSize: fontSizes.normal,
        color: colors.textBoldColor,
        fontWeight: "bold"
    },
    txtDescription: {
        fontSize: fontSizes.small,
        color: colors.textColor,
        marginHorizontal: 2
    },
    boxDescription: {
        flexDirection: "row"
    }
};

export default NavigationBar;