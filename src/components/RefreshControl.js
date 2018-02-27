"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl as Refresh } from 'react-native';
import colors from '~/configs/styles/colors';

class RefreshControl extends React.PureComponent {

    static displayName = "@RefreshControl";

    static propTypes = Refresh.propTypes;

    static defaultProps = {
        colors: colors.refreshColor,
        titleColor: colors.refreshTitleColor
    };

    render() {

        const {
            title = translate("list_message.pull_to_refresh"),
            ...otherProps
        } = this.props;

        return (
            <Refresh 
                {...otherProps}
                title = {title}
            />
        );
    }
}

export default RefreshControl;