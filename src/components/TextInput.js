"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as Input } from 'react-native';
import { colors, sizes, fontSizes } from '~/configs/styles';
import mergeStyle from '~/library/mergeStyle';
import { NUMBER_MAXLENGTH, PHONE_MAXLENGTH, EMAIL_MAXLENGTH, NUMBER_FORMAT } from '~/constants/format';
import numberFormat from '~/utilities/numberFormatInput';

class TextInput extends React.PureComponent {

    static displayName = "@TextInput";

    static propTypes = {
        errorStyle: Input.propTypes.style,
        warningStyle: Input.propTypes.style,
        disableStyle: Input.propTypes.style,
        status: PropTypes.oneOf([
            null,
            "loading",
            "error",
            "warning"
        ]),
        type: PropTypes.oneOf([
            "number",
            "phone",
            "email",
            "password"
        ]),
        numberFormat: PropTypes.string,
        onRef: PropTypes.func
    };

    static defaultProps = {
        status: null,
        returnKeyType: "next",
        selectTextOnFocus: true,
        underlineColorAndroid: colors.underlineColorAndroid,
        placeholderTextColor: colors.placeholderTextColor,
        selectionColor: colors.inputSelectionColor,
        numberFormat: NUMBER_FORMAT,
        editable: true
    };

    render() {

        const {
            style,
            multiline,
            autoGrow,
            editable,
            errorStyle,
            warningStyle,
            disableStyle,
            status,
            keyboardType,
            type,
            maxLength,
            secureTextEntry,
            children,
            onChangeText,
            onRef,
            ...otherProps
        } = this.props;

        return (
            <Input
                {...otherProps}
                editable                 = {status === "loading" ? false : editable}
                autoGrow                 = {autoGrow !== undefined ? autoGrow : multiline}
                multiline                = {multiline}
                keyboardType             = {keyboardType || MappingKeyboardType[type]}
                maxLength                = {maxLength || MappingMaxlength[type]}
                secureTextEntry          = {secureTextEntry !== undefined ? secureTextEntry : type === "password"}
                style                    = {[ 
                    _styles.container,
                    mergeStyle(style),
                    (!editable || status === "loading") && mergeStyle(_styles.disableStyle, disableStyle ),
                    status               === "warning" && mergeStyle(_styles.warningStyle, warningStyle),
                    status               === "error" && mergeStyle(_styles.errorStyle, errorStyle)
                ]}
                onChangeText             = {type === "number" ? this._onChangeTextNumber : onChangeText}
                ref                      = {(ref) => onRef && onRef(ref)}
            >{children}</Input>
        );
    }

    _onChangeTextNumber = (text = "") => {

        this.props.onChangeText && this.props.onChangeText(numberFormat(text, this.props.numberFormat));
    };
}

const MappingKeyboardType = {
    "number": "numeric",
    "phone": "phone-pad",
    "email": "email-address"
};

const MappingMaxlength = {
    "number": NUMBER_MAXLENGTH,
    "phone": PHONE_MAXLENGTH,
    "email": EMAIL_MAXLENGTH
};

const _styles = {
    container: {
        backgroundColor: colors.inputBackgroundColor,
        color: colors.inputTextColor,
        fontSize: fontSizes.normal,
        padding: 0,
        width: "100%",
        minHeight: fontSizes.normal
    },
    errorStyle: {
        borderWidth: sizes.inputBorderWidth,
        borderColor: colors.inputErrorBorderColor
    },
    warningStyle: {
        borderWidth: sizes.inputBorderWidth,
        borderColor: colors.inputWarningBorderColor
    },
    disableStyle: {
        borderColor: colors.inputDisableBorderColor,
        backgroundColor: colors.inputDisableBackgroundColor
    }
};

export default TextInput;