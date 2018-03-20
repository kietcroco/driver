"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text,TouchableOpacity } from 'react-native';
import { sizes, colors, fontSizes, scale } from '~/configs/styles';
import IonIcon from 'react-native-vector-icons/Ionicons';
import getRoute from "~/utilities/getRoute";

class Tabbar extends React.Component {

    static displayName = "@Tabbar";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {
        const { navigation } = this.props;

        const route = getRoute(navigation.state);
        
        return (
            <View style={_styles.view}>
                <TouchableOpacity style={_styles.button}
                    onPress={() => navigation.navigate('/home')}
                >
                    <IonIcon name="md-home" 
                        style={[_styles.icon_28, route.routeName === "/home" && _styles.iconActive]}/>
                    <Text style={[_styles.text_style, route.routeName === "/home" && _styles.iconActive]}>{translate('tabNavigator.Home')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={_styles.button}
                    onPress={() => navigation.navigate('/setting')}
                >
                    <IonIcon name="md-settings" 
                        style={[_styles.icon_28 , route.routeName === "/setting" && _styles.iconActive]}/>
                    <Text style={[_styles.text_style, route.routeName === "/setting" && _styles.iconActive]}>{translate('tabNavigator.Setting')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={_styles.button}>
                    <IonIcon name="ios-notifications" style={[_styles.icon_28, route.routeName === "/notification" && _styles.iconActive]}/>
                    <Text style={[_styles.text_style, route.routeName === "/notification" && _styles.iconActive]}>{translate('tabNavigator.Notification')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={_styles.button}>
                    <IonIcon name="md-person" style={[_styles.iconNormal, route.routeName === "/profile" && _styles.iconActive]}/>
                    <Text style={[_styles.text_style, route.routeName === "/profile" && _styles.iconActive]}>{translate('tabNavigator.Profile')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const _styles = {
    container: {
        height: sizes.footerHeight,
        borderTopWidth: 1,
        borderTopColor: "red",
    },
    view: {
        height: sizes.footerHeight,
        borderTopWidth: 1,
        borderTopColor: colors.headerBackgroundColor,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    iconNormal: {
        fontSize: 30 * scale
    },
    icon_28:{
        fontSize: 28 * scale
    },
    iconActive: {
        color: colors.headerBackgroundColor
    },
    text_style: {
        fontSize: fontSizes.small
    }
};

export default Tabbar;