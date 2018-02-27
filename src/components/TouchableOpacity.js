"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as Touchable } from 'react-native';
import { colors, hitSlop as configHitSlop, scale } from '~/configs/styles';
import ActivityIndicator from '~/components/ActivityIndicator';

class TouchableOpacity extends React.PureComponent {

    static displayName = "@TouchableOpacity";

    static propTypes = {
        status: PropTypes.oneOf([
            null,
            "loading",
            "error",
            "warning"
        ]),
        onRef: PropTypes.func,
        enableLoader: PropTypes.bool
    };

    static defaultProps = {
        status: null,
        enableLoader: true
    };

    render() {
        
        const {
            activeOpacity,
            onPress,
            hitSlop,
            children,
            onRef,
            status,
            enableLoader,
            ...otherProps
        } = this.props;
        return (
            <Touchable
                {...otherProps}
                activeOpacity = {status === "loading" ? 1 : (activeOpacity !== undefined ? activeOpacity : colors.activeOpacity) }
                onPress       = {status === "loading" ? undefined: onPress}
                hitSlop       = {hitSlop || configHitSlop}
                ref           = {(ref)  =>  onRef && onRef(ref)}
            >
                {
                    children
                }
                {
                    enableLoader && status === "loading" &&
                        <ActivityIndicator style={_styles.loading}/>
                }
            </Touchable>
        );
    }
}

const _styles = {
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    loading: {
        marginLeft: 5 * scale
    }
};

export default TouchableOpacity;