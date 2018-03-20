"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Switch, Picker } from 'react-native';
import I18n from '~/library/i18n/I18n';
import { locales } from '~/configs/i18n';
import ImageCache from '~/components/ImageCache';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IOIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sizes, colors, fontSizes, scale } from '~/configs/styles';

class Setting extends React.Component {

    static displayName = "@Setting";

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static defaultProps = {
    };

    static navigationOptions = (navigation) => {
        return {
            title: translate('setting.title')
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            gps: false,
            notification: false,
            language: I18n.locale,
            color_switch_gps: null,
            color_switch_notification: null
        }

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        return (
            <View style={_styles.container}>
                <View style={_styles.view_inside_container}>
                    <View style={_styles.view_title}>
                        <MCIcon name={'web'}
                            style={_styles.style_icon}
                        />
                        <Text style={_styles.style_padding_left}>{translate('setting.language')}</Text>
                    </View>
                    <View style={_styles.view_language}>
                        <Picker
                            style={_styles.picker_language}
                            selectedValue={this.state.language}
                            mode="dropdown"
                            onValueChange={(itemValue, itemIndex) => {
                                I18n.locale = itemValue;
                            }
                            }
                        >
                            {
                                Object.keys(locales).map((code) => {
                                    return <Picker.Item key={`locale-${code}`} label={translate('locales.' + code)} value={code} />
                                })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={_styles.view_inside_container}>
                    <View style={_styles.view_title}>
                        <MCIcon name={'crosshairs-gps'}
                            style={_styles.style_icon}
                        />
                        <Text style={_styles.style_padding_left}>{translate('setting.gps')}</Text>
                    </View>
                    <Switch
                        value={this.state.gps}
                        onValueChange={() => {
                            let colr_switch = null;
                            if (this.state.color_switch_gps == null) colr_switch = colors.headerBackgroundColor;
                            this.setState({
                                ...this.state,
                                gps: !this.state.gps,
                                color_switch_gps: colr_switch
                            })
                        }}
                        onTintColor={colors.headerBackgroundColor}
                        thumbTintColor= {this.state.color_switch_gps}
                    />
                </View>
                <View style={_styles.view_inside_container}>
                    <View style={_styles.view_title}>
                        <MCIcon name={'bell-ring'}
                            style={_styles.style_icon}
                        />
                        <Text style={_styles.style_padding_left}>{translate('setting.notification')}</Text>
                    </View>
                    <Switch
                        value={this.state.notification}
                        onValueChange={() => {
                            let colr_switch = null;
                            if (this.state.color_switch_notification == null) colr_switch = colors.headerBackgroundColor;
                            this.setState({
                                ...this.state, 
                                notification: !this.state.notification,
                                color_switch_notification: colr_switch
                            })
                        }}
                        onTintColor={colors.headerBackgroundColor}
                        thumbTintColor= {this.state.color_switch_notification}
                    />
                </View>
            </View>
        );
    }

    componentDidMount() {
        this._eventLocaleChange = I18n.onChangeLocale(locale => this.setState({
            ...this.state,
            language: locale
        }));
    }

    componentWillUnmount() {
        if (this._eventLocaleChange && this._eventLocaleChange.remove) {
            this._eventLocaleChange.remove();
        }
    }
}

const _styles = {
    container: {
        flex: 1,

        marginVertical: sizes.margin * 2,
        marginHorizontal: sizes.margin * 2
    },
    btnBack: {
        width: sizes.buttonHeight,
        height: "100%",
        justifyContent: "center",
        alignItems: 'center'
    },
    picker_language: {
        height: 25 * scale,
        width: 150 * scale
    },
    wireless_networks: {
        color: colors.textColor, 
        fontSize: fontSizes.normal
    },
    iconBack: {
        textAlign: "center",
        color: colors.textSinkingColor,
        fontSize: fontSizes.large * scale,
        marginTop: 2 * scale
    },
    view_inside_container: {
        flexDirection: 'row',
        marginVertical: sizes.margin,
        justifyContent: 'space-between'
    },
    view_title: {
        flexDirection: 'row'
    },
    style_padding_left: {
        paddingLeft: sizes.large,
 
        color: colors.textColor,
        fontSize: fontSizes.normal
    },
    view_language: {
        borderBottomWidth: 1 * scale,

        borderBottomColor: colors.headerBackgroundColor
    },
    style_icon: {
        color: colors.headerBackgroundColor,
        fontSize: 20 * scale
    }
};

export default Setting;