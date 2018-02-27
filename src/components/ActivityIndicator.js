"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator as ActivityI } from 'react-native';
import colors from '~/configs/styles/colors';

class ActivityIndicator extends React.PureComponent {

    static displayName = "@ActivityIndicator";

    static propTypes = ActivityI.propTypes;

    static defaultProps = {
        animating: true,
        color: colors.activityIndicator,
        size: "small",
        hidesWhenStopped: true
    };

    render() {

        const {
            style,
            children,
            ...otherProps
        } = this.props;

        return (
            <ActivityI
                style={style || _style}
                {...otherProps}
            >
                {children}
            </ActivityI>
        );
    }
}

const _style = {
    flex: 1
};

export default ActivityIndicator;