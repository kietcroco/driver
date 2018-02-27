"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { sizes } from '~/configs/styles';
import IonIcon from 'react-native-vector-icons/Ionicons';

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

        // console.log(this.props.getScreenDetails(this.props.scene) );

        return (
            <View style={{
                height: sizes.footerHeight,
                borderTopWidth: 1,
                borderTopColor: "red",
                flexDirection: "row",
                justifyContent: "space-around"
            }}>
                <View style={{
                    flex: 1,
                    // backgroundColor: "yellow",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <IonIcon name="md-home" style={{
                        fontSize: 28
                    }}/>
                    <Text style={{
                        fontSize: 12
                    }}>Home</Text>
                </View>
                <View style={{
                    flex: 1,
                    // backgroundColor: "blue",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <IonIcon name="md-settings" style={{
                        fontSize: 28
                    }}/>
                    <Text style={{
                        fontSize: 12
                    }}>Cài đặt</Text>
                </View>
                <View style={{
                    flex: 1,
                    // backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <IonIcon name="ios-notifications" style={{
                        fontSize: 28
                    }}/>
                    <Text style={{
                        fontSize: 12
                    }}>Thông báo</Text>
                </View>
                <View style={{
                    flex: 1,
                    // backgroundColor: "green",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <IonIcon name="md-person" style={{
                        fontSize: 30
                    }}/>
                    <Text style={{
                        fontSize: 12
                    }}>Profile</Text>
                </View>
            </View>
        );
    }
}

const _styles = {
    container: {
        height: sizes.footerHeight,
        borderTopWidth: 1,
        borderTopColor: "red",
    }
};

export default Tabbar;