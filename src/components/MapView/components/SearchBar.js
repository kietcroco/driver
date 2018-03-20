"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { scale, colors, fontSizes, sizes } from '~/configs/styles';
import SectionBox from './SectionBox';

class SearchBar extends React.PureComponent {

    static displayName = "@SearchBar";

    static propTypes = {
        menuOnPress: PropTypes.func, // sự kiện nhấn vào menu
        directionOnPress: PropTypes.func, // sự kiện nhấn vào nút chỉ đường
        directionButton: PropTypes.bool, // có hiển thị nút chỉ đường không
        placeholder: PropTypes.string, // placeholder
        children: PropTypes.string, // text vị trí
        onPress: PropTypes.func, // sự kiện click vào text
        backOnPress: PropTypes.func, // sự kiện click nút back
        backButton: PropTypes.bool, // có hiển thị nút back không
        clearOnPress: PropTypes.func, // sự kiện click nút xoá
        onRef: PropTypes.func
    };

    static defaultProps = {
        directionButton: true,
        children: "",
        backButton: false,
        editable: false
    };

    render() {

        const {
            style,
            menuOnPress,
            directionOnPress,
            directionButton,
            placeholder = translate("maps.search_placeholder"),
            children,
            onPress,
            backButton,
            backOnPress,
            editable,
            clearOnPress,
            onRef,
            ...otherProps
        } = this.props;

        return (
            <SectionBox style={style ? [_styles.container, style] : _styles.container}>
                <TouchableOpacity onPress={backButton ? backOnPress : menuOnPress} activeOpacity={colors.activeOpacity} style={_styles.button}>
                    <MtIcon name={backButton ? 'arrow-back' : 'menu'} style={_styles.iconMenu} />
                </TouchableOpacity>
                <TouchableOpacity onPress={(editable ? undefined : onPress)} style={_styles.textContainer} activeOpacity={1}>
                    {
                        !editable ?
                            <Text numberOfLines={1} style={`${children}` ? _styles.text : _styles.placeholder}>{children || placeholder}</Text>
                        : <TextInput
                            {...otherProps}
                            placeholder           = {placeholder}
                            selectTextOnFocus     = {true}
                            editable              = {editable}
                            underlineColorAndroid = {colors.underlineColorAndroid}
                            placeholderTextColor  = {colors.placeholderTextColor}
                            selectionColor        = {colors.inputSelectionColor}
                            returnKeyType         = "search"
                            value                 = {`${children}`}
                            style                 = {_styles.input}
                            numberOfLines         = {1}
                            blurOnSubmit          = {true}
                            ref                   = {ref => {
                                this.input = ref;
                                onRef && onRef(ref);
                            }}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={`${children}` ? clearOnPress : undefined} activeOpacity={`${children}` ? colors.activeOpacity : 1} style={_styles.button}>
                    <MtIcon name={`${children}` ? "close" : "search"} style={`${children}` ? _styles.iconNormal : _styles.iconPlaceHolder} />
                </TouchableOpacity>
                {
                    directionButton &&
                        <View style={_styles.separate} />
                }
                {
                    directionButton &&
                    <TouchableOpacity onPress={directionOnPress} activeOpacity={colors.activeOpacity} style={_styles.button}>
                        <MtIcon name="directions" style={_styles.iconNormal} />
                    </TouchableOpacity>
                }
            </SectionBox>
        );
    }
}

const _styles = {
    container: {
        flexDirection: "row",
        height: 50 * scale,
        margin: 10 * scale,
        // marginBottom: sizes.spacing,
        opacity: 0.95,
        alignItems: "center",
    },
    button: {
        width: 50 * scale,
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    separate: {
        width: 1,
        height: "60%",
        backgroundColor: colors.mapSeparateBackgroundColor
    },
    textContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "center"
    },
    input: {
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
        color: colors.inputTextColor,
        fontSize: fontSizes.normal,
        width: "100%",
        height: "100%"
    },
    iconMenu: {
        fontSize: 28 * scale,
        color: colors.textColor
    },
    iconPlaceHolder: {
        fontSize: 28 * scale,
        color: colors.placeholderTextColor
    },
    iconNormal: {
        fontSize: 28 * scale,
        color: colors.textColor
    }
};

export default SearchBar;