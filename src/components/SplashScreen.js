"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ImageCache from '~/components/ImageCache';
import { scale, colors } from '~/configs/styles';

class LogoBackground extends React.PureComponent {

    static displayName = "@LogoBackground";

    render() {

        return (
            <ImageCache
                style={_styles.background}
                source={require("~/assets/images/background.png")}
            >
                <View style={_styles.logoBox}>
                    <ImageCache
                        style={_styles.logo}
                        source={require("~/assets/images/logo1.png")}
                    />
                </View>
                <View style={_styles.contentBox}>
                    {
                        this.props.children
                    }
                </View>
            </ImageCache>
        );
    }
}

const _styles = {
    background: {
        flex: 1,
        resizeMode: "cover",
        backgroundColor: colors.splashScreenBackgroundColor
    },
    logoBox: {
        height: "42%",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 40 * scale
    },
    logo: {
        height: "50%",
        width: "100%",
        resizeMode: "contain"
    },
    contentBox: {
        width: "100%",
        alignItems: "center",
        height: "58%"
    }
};

export default LogoBackground;