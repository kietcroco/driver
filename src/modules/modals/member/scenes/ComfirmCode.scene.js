"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Platform } from 'react-native';
import TouchableOpacity from '~/components/TouchableOpacity';
import TextInput from '~/components/TextInput';
import { colors, sizes, fontSizes, scale } from '~/configs/styles';
import ImageCache from '~/components/ImageCache';
import Panel from '~/components/Panel';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import verifyService from '~/services/member/verify';
import { NavigationActions } from 'react-navigation';
import { AUTH_IDENTITY } from '~/constants/registryKey';

class ComfirmCode extends React.Component {

    static displayName = "@ComfirmCode";

    static navigationOptions = {
        headerMode: "none"
    };

    constructor( props ) {
        super( props );

        this.state = {
            loading: false,
            account_active_code: "",
            errorMessage: ""
        };
    }

    shouldComponentUpdate( nextProps, nextState ) {

        return (
            this.state.account_active_code !== nextState.account_active_code
            || this.state.loading !== nextState.loading
            || this.state.errorMessage !== nextState.errorMessage
        );
    }

    render() {


        return (
            <View style={_styles.container}>
                <View style={_styles.header}>
                    <ImageCache 
                        style  = {_styles.logo}
                        source = {require('~/assets/images/logo.png')}
                    />
                </View>
                <Panel
                    style           = {_styles.panel}
                    headerTextStyle = {_styles.panelHeader}
                    contentStyle    = {_styles.panelContent}
                    header          = {translate("member.comfirm_active.comfirm_title_message")}
                >
                    <View style={_styles.activeCodeRow}>
                        <FAIcon name="mobile" style={_styles.iconPhone}/>
                        <View style={_styles.inputContainer}>
                            <TextInput
                                status            = {this.state.loading ? "loading" : (this.state.errorMessage ? "error" : null)}
                                style             = {_styles.input}
                                autoFocus         = {true}
                                keyboardType      = "numeric"
                                maxLength         = {6}
                                returnKeyType     = "done"
                                selectTextOnFocus = {true}
                                placeholder       = {translate("member.comfirm_active.comfirm_code_placeholder")}
                                value             = {this.state.account_active_code}
                                onChangeText      = {this._onChangeText}
                                onSubmitEditing   = {this._onSubmit}
                            />
                            {
                                !!this.state.errorMessage && !this.state.loading &&
                                    <Text style={_styles.errorMessage}>{ this.state.errorMessage }</Text>
                            }
                        </View>
                    </View>
                    <View style={_styles.descriptionRow}>
                        <Text style={_styles.waitingMinute}>
                            <Text style={_styles.resendMessage} onPress={this._onResendCode}>
                                { translate("member.comfirm_active.comfirm_resend_code") }
                            </Text>
                            {` (${translate("member.comfirm_active.comfirm_waiting_5minute")})`}
                        </Text>
                    </View>
                    <View style={_styles.buttonRow}>
                        <TouchableOpacity
                            style        = {_styles.buttonSubmit}
                            status       = {this.state.loading ? "loading" : null}
                            enableLoader = {false}
                            onPress      = {this._onSubmit}
                        >
                            <Text style={_styles.labelSubmit}>{translate("member.comfirm_active.comfirm_submit")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style        = {_styles.buttonCancel}
                            // status       = {this.state.loading ? "loading" : null}
                            enableLoader = {false}
                            onPress      = {this._onCancel}
                        >
                            <Text style={_styles.labelCancel}>{translate("member.comfirm_active.comfirm_cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </Panel>
            </View>
        );
    }

    componentDidMount() {

        const {
            navigation: {
                state: {
                    params: {
                        account_mobile
                    } = {}
                }
            }
        } = this.props;

        if (!account_mobile) {

            return this.props.navigation.goBack();
        }

        // sự kiện sms
        if (Platform.OS === "android") {

            const SmsListener = require("react-native-android-sms-listener").default;
            this._smsSubscription = SmsListener.addListener(message => {
    
                let verificationCodeRegex = /: ([\d]+)/
    
                if (verificationCodeRegex.test(message.body)) {
                    
                    let verificationCode = message.body.match(verificationCodeRegex)[1];
    
                    this.setState({
                        account_active_code: verificationCode
                    }, () => {

                        this._onSubmit();
                    });
                }
            });
        }
    }

    componentWillUnmount() {

        // remove sms event
        this._smsSubscription 
            && this._smsSubscription.remove 
            && this._smsSubscription.remove()
        ;

        this._stopRequest();
    }

    _onChangeText = (account_active_code = "") => {

        account_active_code !== this.state.account_active_code && this.setState({
            account_active_code
        });
    };

    // huỷ request
    _stopRequest = () => {

        if (this._request && this._request.abort) {

            this._request.abort();
            this._request = undefined;
        }
    };

    // sự kiện submit
    _onSubmit = async () => {
        
        this.setState({
            loading: true
        });

        try {

            const {
                navigation: {
                    state: {
                        params: {
                            account_mobile
                        } = {}
                    }
                }
            } = this.props;

            // stop request cũ và khởi tạo request mới
            this._stopRequest();
            this._request = verifyService.verify({
                account_mobile,
                account_active_code: this.state.account_active_code
            });
            const res = await this._request;

            this.setState({
                loading: false
            });

            // nếu xác thực thành công
            if (res.status >= 200 && res.status < 300 && res.data) {

                if (res.data["STATUS"] == "OK") {

                    // reset về trang home
                    this.props.navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: '/', params: {
                                title: Registry.get(AUTH_IDENTITY) ? Registry.get(AUTH_IDENTITY).account_fullname : 'Home'
                            } })
                        ]
                    }));
                    toast(translate("member.login.login_success"));
                    return;
                }
            }

            toast(translate("member.comfirm_active.comfirm_failed"));
        } catch (e) {

            toast(e.message || translate("member.comfirm_active.comfirm_failed"));
        }
        
        this.setState({
            loading: false
        });
    };

    _onCancel = () => {

        this._stopRequest();
        this.props.navigation.goBack();
    };

    _onResendCode = () => {

    };
}

const _styles = {
    container: {
        flex: 1
    },
    header: {
        height: "12%",
        backgroundColor: colors.headerBackgroundColor,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: sizes.padding
    },
    logo: {
        height: "100%",
        flex: 1,
        resizeMode: "contain"
    },
    panel: {
        margin: sizes.margin
    },
    panelHeader: {
        textAlign: "center",
        fontSize: fontSizes.large,
        fontWeight: "bold"
    },
    panelContent: {
        padding: 30 * scale
    },
    activeCodeRow: {
        flexDirection: "row"
    },
    iconPhone: {
        fontSize: 200 * scale
    },
    inputContainer: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: sizes.padding
    },
    input: {
        width: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: fontSizes.large,
        color: colors.inputTextColor,
        backgroundColor: colors.inputBackgroundColor,
        borderRadius: sizes.buttonBorderRadius,
        paddingHorizontal: sizes.buttonBorderRadius,
        paddingVertical: sizes.spacing,
        borderColor: colors.panelHeaderBackgroundColor,
        borderWidth: sizes.inputBorderWidth,
        marginBottom: sizes.margin
    },
    errorMessage: {
        fontSize: fontSizes.normal,
        color: colors.textErrorColor
    },
    descriptionRow: {
        flexDirection: "row"
    },
    resendMessage: {
        fontSize: fontSizes.normal,
        color: colors.textTouchableColor
    },
    waitingMinute: {
        fontSize: fontSizes.normal,
        color: colors.textItalicColor,
        fontStyle: "italic"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    buttonSubmit: {
        backgroundColor: colors.buttonSubmitBackgroundColor,
        margin: sizes.spacing,
        paddingHorizontal: 10 * scale,
        paddingVertical: 5 * scale,
        borderRadius: 20 * scale,
        width: 80 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonCancel: {
        backgroundColor: colors.buttonResetBackgroundColor,
        margin: sizes.spacing,
        paddingHorizontal: 10 * scale,
        paddingVertical: 5 * scale,
        borderRadius: 20 * scale,
        width: 80 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    labelSubmit: {
        fontSize: fontSizes.normal,
        color: colors.textSinkingColor
    },
    labelCancel: {
        fontSize: fontSizes.normal,
        color: colors.textColor
    }
};

export default ComfirmCode;