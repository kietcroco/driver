"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Txt } from 'react-native';
import { colors, fontSizes } from '~/configs/styles';
import mergeStyle from '~/library/mergeStyle';

class Text extends React.PureComponent {

    static displayName = "@Text";

    static propTypes = {
        status: PropTypes.oneOf([
            null,
            "loading",
            "error",
            "warning"
        ]),
        onRef: PropTypes.func
    };

    static defaultProps = {
        status: null
    };

    render() {

        const {
            style,
            status,
            children,
            onRef,
            ...otherProps
        } = this.props;

        return (
            <Txt
                {...otherProps}
                style      = {[ 
                    _styles.container,
                    mergeStyle(style),
                    status === "warning" && _styles.warning,
                    status === "success" && _styles.success,
                    status === "error" && _styles.error,
                    status === "loading" && _styles.disable
                ]}
                ref        = {( ref ) => onRef && onRef(ref)}
            >
                {children}
            </Txt>
        );
    }
}

const _styles = {
    container: {
        fontSize: fontSizes.normal,
        color: colors.textColor
    },
    error: {
        color: colors.textErrorColor
    },
    warning: {
        color: colors.textWarningColor
    },
    success: {
        color: colors.textSuccessColor
    },
    disable: {
        color: colors.textDisableColor
    }
};

export default Text;