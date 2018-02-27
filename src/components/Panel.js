"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { colors, sizes, fontSizes } from '~/configs/styles';

class Panel extends React.PureComponent {

    static displayName = "@Panel";

    static propTypes = {
        header: PropTypes.any,
        headerTextStyle: PropTypes.object,
        headerStyle: PropTypes.object,
        contentStyle: PropTypes.object
    };

    render() {

        const {
            style,
            header,
            headerStyle,
            headerTextStyle,
            children,
            contentStyle
        } = this.props;

        return (
            <View style={[_styles.container, style]}>
                <View style={[_styles.header, headerStyle]}>
                    {
                        !!header && typeof header === "string" &&
                            <Text style={[_styles.headerText, headerTextStyle]}>{header}</Text>
                    }
                </View>
                <View style={[_styles.content, contentStyle]}>
                    {
                        children
                    }
                </View>
            </View>
        );
    }
}

const _styles = {
    container: {
        borderWidth: sizes.panelBorderWidth,
        borderColor: colors.pannelBorderColor
    },
    header: {
        padding: sizes.spacing,
        minHeight: sizes.panelHeaderMinHeight,
        backgroundColor: colors.panelHeaderBackgroundColor,
        borderBottomWidth: sizes.panelBorderWidth,
        borderBottomColor: colors.pannelBorderColor
    },
    headerText: {
        color: colors.textSinkingColor,
        fontSize: fontSizes.normal
    },
    content: {
        padding: sizes.spacing
    }
};

export default Panel;