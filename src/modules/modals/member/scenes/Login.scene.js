"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import TextInput from '~/components/TextInput';
import TouchableOpacity from '~/components/TouchableOpacity';
import { scale, colors, fontSizes, sizes, hitSlop } from '~/configs/styles';
import SplashScreen from '~/components/SplashScreen';
import loginService from '~/services/member/login';
import DeviceInfo from 'react-native-device-info';
import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { AUTHORIZATION } from '~/constants/registryKey';

class Login extends React.Component {

    static displayName = "@Login";

    static navigationOptions = {
        headerMode: "none"
    };

    constructor( props ) {
        super( props );

        const {
            navigation: {
                state: {
                    params: {
                        account_mobile
                    } = {}
                }
            }
        } = props;

        this.state = {
            account_mobile,
            loading: false,
            hideForm: true
        };
    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return (
            this.state.account_mobile !== nextState.account_mobile
            || this.state.loading !== nextState.loading
            || this.state.hideForm !== nextState.hideForm
        );
    }

    render() {

        return (
            <SplashScreen>
                {
                    !this.state.hideForm &&
                        <View style={_styles.container}>
                            <TextInput 
                                type              = "phone"
                                status            = {this.state.loading ? "loading": null}
                                style             = {_styles.input}
                                autoFocus         = {true}
                                returnKeyType     = "done"
                                selectTextOnFocus = {true}
                                placeholder       = {translate("member.login.phone_placeholder")}
                                value             = {this.state.account_mobile}
                                onChangeText      = {this._onInputChange}
                                onSubmitEditing   = {this._onSubmit}
                            />
                            <TouchableOpacity
                                hitSlop = {null}
                                style   = {_styles.buttonSubmit}
                                status  = {this.state.loading ? "loading": null}
                                onPress = {this._onSubmit}
                            >
                                <Text
                                    style={[_styles.labelSubmit, this.state.loading && _styles.labelSubmitDisable]}
                                >{this.state.loading ? translate("member.login.waiting") : translate("member.login.login_label")}</Text>
                            </TouchableOpacity>
                        </View>
                }
            </SplashScreen>
        );
    }

    componentDidMount() {
        
        (async () => {
            
            let account_mobile = await this._syncMobilePhone();
            account_mobile = `${account_mobile}`;

            this.setState({
                account_mobile
            });

            if (!Registry.get(AUTHORIZATION)) {

                this.setState({
                    loading: false,
                    hideForm: false
                });
            } else {

                this._login({
                    access_token: Registry.get(AUTHORIZATION)
                });
            }
        })();
    }

    componentWillUnmount() {

        this._stopRequest();
    }

    // hàm sync số điện thoại xuống local store
    _syncMobilePhone = async (account_mobile) => {

        try {
            if (account_mobile) {

                await AsyncStorage.setItem('@account_mobile', `${account_mobile}`);
            } else {

                account_mobile = await AsyncStorage.getItem('@account_mobile');
            }
        } catch (error) {}

        return account_mobile || DeviceInfo.getPhoneNumber() || "";
    };

    // huỷ request
    _stopRequest = () => {

        if (this._request && this._request.abort) {

            this._request.abort();
            this._request = undefined;
        }
    };

    // hàm đăng nhập
    _login = async (credentials = {}) => {

        this.setState({
            loading: true
        });

        try {
            
            this._stopRequest();
            this._request = loginService.login(credentials);
            const res = await this._request;
            this.setState({
                loading: false
            });
            
            this._syncMobilePhone( this.state.account_mobile );


            if (res.status >= 200 && res.status < 300 && res.data) {
                // this.props.navigation.setParams({account: res.data["data"]});
                switch (res.data["STATUS"]) {

                    case "OK": // đăng nhập bằng số điện thoại cần active lại

                        this.setState({
                            loading: false,
                            hideForm: false
                        });
                        this.props.navigation.navigate('/member/comfirm-code', {
                            account_mobile: this.state.account_mobile || ""
                        });
                        toast(translate("member.login.login_comfirm_active"));
                        return;
                    case "AUTHENTICATED": // đăng nhập bằng token cũ không cần active

                        // reset về trang home
                        this.props.navigation.dispatch(NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: '/' })
                            ]
                        }));
                        toast(translate("member.login.login_success"));
                        return;
                    case "UNAUTHENTICATED": // chưa có tài khoản trên server
                        
                        this.setState({
                            loading: false,
                            hideForm: false
                        });
                        this.props.navigation.navigate('/member/register', {
                            account_mobile: this.state.account_mobile || ""
                        });
                        toast(translate("member.login.not_yet_account"));
                        return;
                }
            }

            toast(translate("member.login.login_failed"));
        } catch (e) {

            toast(e.message || translate("member.login.login_failed"));
        }

        this.setState({
            loading: false,
            hideForm: false
        });
    };

    // sự kiện submit
    _onSubmit = () => {

        const credentials = {
            account_mobile: this.state.account_mobile
        };

        this._login(credentials);
    };

    // sự kiện nhập input
    _onInputChange = (account_mobile = "") => {

        account_mobile !== this.state.account_mobile && this.setState({
            account_mobile
        });
    };
}

const _styles = {
    container: {
        width: "90%",
        alignItems: "center"
    },
    input: {
        width: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        marginBottom: "20%",
        fontSize: fontSizes.large,
        color: colors.inputTextColor,
        backgroundColor: colors.inputBackgroundColor,
        borderRadius: sizes.buttonBorderRadius,
        paddingHorizontal: sizes.buttonBorderRadius,
        paddingVertical: sizes.spacing
    },
    buttonSubmit: {
        backgroundColor: colors.buttonLoginBackgroundColor,
        borderRadius: sizes.buttonBorderRadius,
        height: sizes.buttonLargeHeight,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    labelSubmit: {
        fontSize: fontSizes.large,
        color: colors.textSinkingColor,
        textAlign: "center",
        textAlignVertical: "center"
    },
    labelSubmitDisable: {
        color: colors.textDisableColor
    }
};

export default Login;