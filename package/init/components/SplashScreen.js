"use strict";
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

class SplashScreen extends React.PureComponent {

    static displayName = "@SplashScreen";

    render() {

        return (
            <View style={_styles.container}>
                <ActivityIndicator 
                    size="large" 
                    color="#0000ff"
                />
            </View>
        );
    }
}

const _styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

export default SplashScreen;