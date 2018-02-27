import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput as Input, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
//import shallowEqual from 'fbjs/lib/shallowEqual';
import { sizes, colors as _colors, fontSizes, scale } from '~/configs/styles';

class ModalInput extends React.Component {

    static displayName = '@text-input';

    static propTypes = {
        style: PropTypes.object, // style tổng
        containerStyle: PropTypes.object, // style input container
        inputStyle: PropTypes.object, // style input
        labelStyle: PropTypes.object, // style label
        label: PropTypes.string,
        required: PropTypes.bool, // dấu *
        numeric: PropTypes.bool, // Chỉ cho phép nhập kiểu số
        value: PropTypes.oneOfType([ // giá trị
            PropTypes.string,
            PropTypes.number
        ]), // giá trị
        placeholder: PropTypes.string,
        messageType: PropTypes.oneOf([ // loại thông báo lỗi
            "success",
            "error",
            "warning",
            "loading"
        ]),
        type: PropTypes.oneOf([ // loại input
            "input",
            "select",
            "textarea"
        ]),
        rows: PropTypes.number, // số dòng cho textarea
        children: PropTypes.oneOfType([ // thông báo lỗi
            PropTypes.string,
            PropTypes.node
        ]),
        editable: PropTypes.bool, // cho phép sửa input
        onPress: PropTypes.func, // sự kiện click select
        addon: PropTypes.node, // nút bên phải
        addonLeft: PropTypes.node, // nút bên trái
        disableColor: PropTypes.string
    };

    static defaultProps = {
        label: "",
        required: false,
        value: "",
        placeholder: "",
        messageType: null,
        type: "input",
        rows: 3,
        editable: true,
        disableColor: _colors.disableColor
    };

    shouldComponentUpdate(nextProps) {

        return (
            this.props.value !== nextProps.value ||
            this.props.messageType !== nextProps.messageType ||
            this.props.children != nextProps.children ||
            this.props.label !== nextProps.label ||
            this.props.selection != nextProps.selection ||
            this.props.secureTextEntry !== nextProps.secureTextEntry ||
            this.props.caretHidden !== nextProps.caretHidden ||
            this.props.selectTextOnFocus !== nextProps.selectTextOnFocus ||
            this.props.blurOnSubmit !== nextProps.blurOnSubmit ||
            this.props.returnKeyType !== nextProps.returnKeyType ||
            this.props.required !== nextProps.required ||
            this.props.editable !== nextProps.editable ||
            this.props.placeholder !== nextProps.placeholder ||
            this.props.keyboardType !== nextProps.keyboardType ||
            this.props.autoFocus !== nextProps.autoFocus ||
            this.props.maxLength !== nextProps.maxLength ||
            this.props.rows !== nextProps.rows ||
            this.props.autoCapitalize !== nextProps.autoCapitalize ||
            this.props.autoCorrect !== nextProps.autoCorrect ||
            this.props.defaultValue !== nextProps.defaultValue ||
            this.props.disableColor !== nextProps.disableColor ||
            this.props.type !== nextProps.type
            //this.props.selectionColor != nextProps.selectionColor ||
            //!shallowEqual( this.props, nextProps )
        );
    }

    focus() {

        return this.refs.input.focus();
    }
    blur() {

        return this.refs.input.blur();
    }
    update(...args) {

        return this.refs.input.update(...args);
    }

    isFocused() {

        return this.refs.input.isFocused();
    }

    clear() {

        return this.refs.input.clear();
    }

    render() {

        const {
            style,
            containerStyle,
            inputStyle,
            labelStyle,
            label,
            required,
            value,
            placeholder,
            messageType,
            type,
            rows,
            children,
            editable,
            onPress,
            addon,
            addonLeft,
            disableColor,
            ...otherProps
        } = this.props;

        const color = colors[messageType];
        const iconName = iconNames[messageType];

        var paddingRight = 0;
        if ((iconName || messageType === "loading") && type === "select") {

            paddingRight = 40 * scale;
        } else if (iconName || messageType === "loading" || type === "select") {

            paddingRight = 20 * scale;
        }

        const Container = type === "select" ? TouchableOpacity : View;
        const disable = type === "select" ? true : !editable;
        const borderColor = !!color && {
            // borderColor: color // Màu tím 
            borderColor: '#ddd'
        };

        return (
            <View style={style}>
                <View style={[_styles.wrapper, disable && {
                    backgroundColor: disableColor
                }]}>
                    {

                        !!addonLeft &&
                        <View style={[_styles.addon, _styles.addonLeft, borderColor]}>{addonLeft}</View>
                    }
                    <Container
                        style={[_styles.container, containerStyle, !!addon && _styles.addonLeft, !!addonLeft && _styles.addonRight, borderColor]}
                        onPress={onPress}
                    >
                        {
                            !!label &&
                            <View style={_styles.labelWrapper}>
                                <Text numberOfLines={1} style={labelStyle ? [_styles.label, labelStyle] : _styles.label}>{label}</Text>
                                {!!required && <Text style={_styles.required}> *</Text>}
                            </View>
                        }
                        {
                            type !== "select" ?
                                <Input
                                    placeholderTextColor={_styles.placeholderTextColor}
                                    underlineColorAndroid="transparent"
                                    {...otherProps}
                                    style={[_styles.input, inputStyle, { paddingRight }, type === "textarea" && {
                                        height: inputHeight * rows,
                                        textAlignVertical: "top"
                                    }]}
                                    placeholder={placeholder}
                                    multiline={type === "textarea"}
                                    editable={!disable}
                                    value={value ? `${value}` : ""}
                                    ref="input"
                                /> :
                                <Text
                                    style={[_styles.input, inputStyle, { paddingRight }, !`${value}`.length && {
                                        color: _styles.placeholderTextColor
                                    }]}
                                    numberOfLines={1}
                                >{`${value}` || placeholder}</Text>
                        }
                        <View style={[_styles.iconWrapper, (!iconName || messageType !== "loading" || type !== "select") && {
                            justifyContent: "flex-end"
                        }]}>
                            {
                                !!iconName ?
                                    <FAIcon name={iconName} style={[_styles.iconFeedback, !!color && {
                                        color
                                    }]} /> :
                                    (
                                        messageType === "loading" ?
                                            <ActivityIndicator /> : null
                                    )
                            }
                            {
                                type === "select" &&
                                <FAIcon name="sort-down" style={_styles.iconSelect} />
                            }
                        </View>
                    </Container>
                    {
                        !!addon &&
                        <View style={[_styles.addon, _styles.addonRight, borderColor]}>{addon}</View>
                    }
                </View>
                {
                    !!children && typeof children === "string" ?
                        <Text style={{
                            color: color ? color : _colors.normalColor
                        }}>{children}</Text> :
                        children || null
                }
            </View>
        );
    }
}

const inputHeight = 30 * scale;

const colors = {
    // success: _colors.successColor,
    success: _colors.successColor,
    warning: _colors.warningColor,
    error: _colors.errorColor
};

const iconNames = {
    success: "check",
    warning: "exclamation",
    error: "times"
};

const _styles = {
    wrapper: {
        flexDirection: "row",
        //flex: 1,
        //borderRadius: sizes.borderRadius
    },
    container: {
        flex: 1,
        borderWidth: sizes.borderWidth,
        borderColor: _colors.primaryBorderColor,
        paddingHorizontal: 8 * scale,
        position: "relative",
        justifyContent: "center"
    },
    addonRight: {
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    addonLeft: {
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    addon: {
        width: sizes.buttonNormal,
        borderWidth: sizes.borderWidth,
        borderColor: _colors.primaryBorderColor,
        borderRadius: sizes.borderRadius,
        justifyContent: "center",
        alignItems: "center"
    },
    labelWrapper: {
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        color: _colors.normalColor,
        fontSize: fontSizes.small,
        textAlignVertical: "center"
    },
    required: {
        color: _colors.required,
        fontSize: fontSizes.small,
        textAlignVertical: "center"
    },
    placeholderTextColor: _colors.placeholderColor,
    inputWrapper: {
        flex: 1,
        flexDirection: "row"
    },
    input: {
        color: _colors.normalColor,
        padding: 0,
        fontSize: fontSizes.normal,
        height: inputHeight,
        textAlignVertical: "center"
    },
    iconWrapper: {
        position: "absolute",
        right: sizes.margin,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: sizes.buttonNormal,
    },
    iconFeedback: {
        fontSize: 16 * scale,
        color: _colors.boldColor,
    },
    iconSelect: {
        fontSize: 22 * scale,
        marginTop: -9 * scale,
        color: _colors.boldColor
    }
};

export default ModalInput;