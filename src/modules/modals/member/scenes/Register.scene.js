"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Alert } from 'react-native';
import TouchableOpacity from '~/components/TouchableOpacity';
import TextInput from '~/components/TextInput';
import { colors, sizes, fontSizes, scale } from '~/configs/styles';
import ImageCache from '~/components/ImageCache';
import Panel from '~/components/Panel';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import RegisterService from '~/services/member/register';

class Register extends React.Component {

    static displayName = "@Register";

    static propTypes = {
    };

    static defaultProps = {
    };

    static navigationOptions = {
        headerMode: "none"
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            account_mobile: "",
            account_fullname: "",
            account_email: "",
            account_address: "",
            errorMessage: ""
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        // return (
        //     this.state.comfirmCode !== nextState.comfirmCode
        //     || this.state.loading !== nextState.loading
        //     || this.state.errorMessage !== nextState.errorMessage
        // );
        return true;
    }

    render() {

        return (
            <View style={_styles.container}>
                <View style={_styles.header}>
                    <ImageCache
                        style={_styles.logo}
                        source={require('~/assets/images/logo.png')}
                    />
                </View>
                <Panel
                    style={_styles.panel}
                    headerTextStyle={_styles.panelHeader}
                    contentStyle={_styles.panelContent}
                    header={translate("member.register.register_title_message")}
                >
                    {/* Tên đầy đủ */}

                    <View style={_styles.inputContainer}>
                        <View style={_styles.inlineIcon} >
                            <FAIcon name="phone-square" size={20} color={colors.headerBackgroundColor} />
                        </View>
                        <TextInput
                            status={this.state.loading ? "loading" : (this.state.errorMessage ? "error" : null)}
                            style={_styles.input}
                            autoFocus={true}
                            // keyboardType="numeric"
                            returnKeyType="done"
                            selectTextOnFocus={true}
                            placeholder={translate("member.register.register_mobile")}
                            value={this.state.account_mobile}
                            onChangeText={(account_mobile) => {
                                account_mobile !== this.state.account_mobile && this.setState({
                                    account_mobile
                                });
                            }}
                            onSubmitEditing={this._onSubmit}
                        />
                        {
                            !!this.state.errorMessage && !this.state.loading &&
                            <Text style={_styles.errorMessage}>{this.state.errorMessage}</Text>
                        }
                    </View>

                    {/* Tên đầy đủ */}

                    <View style={_styles.inputContainer}>
                        <View style={_styles.inlineIcon} >
                            <FAIcon name="user-circle" size={20} color={colors.headerBackgroundColor} />
                        </View>
                        <TextInput
                            status={this.state.loading ? "loading" : (this.state.errorMessage ? "error" : null)}
                            style={_styles.input}
                            autoFocus={false}
                            // keyboardType="numeric"
                            returnKeyType="done"
                            selectTextOnFocus={true}
                            placeholder={translate("member.register.register_fullname")}
                            value={this.state.account_fullname}
                            onChangeText={(account_fullname = "") => {
                                account_fullname !== this.state.account_fullname && this.setState({
                                    account_fullname
                                });
                            }}
                            onSubmitEditing={this._onSubmit}
                        />
                        {
                            !!this.state.errorMessage && !this.state.loading &&
                            <Text style={_styles.errorMessage}>{this.state.errorMessage}</Text>
                        }
                    </View>

                    {/* Email */}

                    <View style={_styles.inputContainer}>
                        <View style={_styles.inlineIcon} >
                            <FAIcon name="envelope-square" size={20} color={colors.headerBackgroundColor} />
                        </View>
                        <TextInput
                            status={this.state.loading ? "loading" : (this.state.errorMessage ? "error" : null)}
                            style={_styles.input}
                            autoFocus={false}
                            // keyboardType="numeric"
                            returnKeyType="done"
                            selectTextOnFocus={true}
                            placeholder={translate("member.register.register_email")}
                            value={this.state.account_email}
                            onChangeText={(account_email = "") => {
                                account_email !== this.state.account_email && this.setState({
                                    account_email
                                });
                            }}
                            onSubmitEditing={this._onSubmit}
                        />
                        {
                            !!this.state.errorMessage && !this.state.loading &&
                            <Text style={_styles.errorMessage}>{this.state.errorMessage}</Text>
                        }
                    </View>

                    {/* Địa chỉ */}

                    <View style={_styles.inputContainer}>
                        <View style={_styles.inlineIcon} >
                            <FAIcon name="map-signs" size={20} color={colors.headerBackgroundColor} />
                        </View>
                        <TextInput
                            status={this.state.loading ? "loading" : (this.state.errorMessage ? "error" : null)}
                            style={_styles.input}
                            autoFocus={false}
                            // keyboardType="numeric"
                            returnKeyType="done"
                            selectTextOnFocus={true}
                            placeholder={translate("member.register.register_address")}
                            value={this.state.account_address}
                            onChangeText={(account_address = "") => {
                                account_address !== this.state.account_address && this.setState({
                                    account_address
                                });
                            }}
                            onSubmitEditing={this._onSubmit}
                        />
                        {
                            !!this.state.errorMessage && !this.state.loading &&
                            <Text style={_styles.errorMessage}>{this.state.errorMessage}</Text>
                        }
                    </View>

                    {/** Button  */}
                    <View style={_styles.buttonRow}>
                        <TouchableOpacity
                            style={_styles.buttonSubmit}
                            status={this.state.loading ? "loading" : null}
                            enableLoader={false}
                            onPress={this._onSubmit}
                        >
                            <Text style={_styles.labelSubmit}>{translate("member.register.register_submit")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={_styles.buttonCancel}
                            status={this.state.loading ? "loading" : null}
                            enableLoader={false}
                            onPress={this._onCancel}
                        >
                            <Text style={_styles.labelCancel}>{translate("member.register.register_cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </Panel>
            </View>
        );
    }

    /**
     * Submit Đăng ký tài khoản
     */
    _onSubmit = async () => {
        if (!this.state.account_address || !this.state.account_fullname || !this.state.account_mobile) {
            Alert.alert(translate('alert.title'), translate('member.validate.info'));
            return;
        }

        let params = { ...this.state };
        let res = await RegisterService.post(params);
        if (res.status === 200) {
            let data = res.data;
            if (data.STATUS == 'OK') {
                this.props.navigation.navigate('/member/comfirm-code', { account_mobile: data.data.account_mobile });
                return;
            } else {
                Alert.alert(translate('alert.title', data.message));
            }
        }

        Alert.alert(translate('alert.title', translate('alert.error')));
        return;
    };

    /**
     * Hủy đăng ký
     */
    _onCancel = () => {
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
    inputContainer: {
        paddingBottom: sizes.padding
    },
    inlineIcon: {
        position: 'absolute',
        zIndex: 1,
        left: 15,
        top: 10,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height: 40,
        paddingLeft: 45,
        borderRadius: 20
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

export default Register;