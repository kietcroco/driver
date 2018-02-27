"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import FlatList from '~/components/FlatList';
import { scale, fontSizes, colors, sizes } from '~/configs/styles';
import ActivityIndicator from '~/components/ActivityIndicator';
import RefreshControl from '~/components/RefreshControl';

class ListBasic extends React.PureComponent {

    static displayName = "@ListBasic";

    static propTypes = {
        separator: PropTypes.bool,
        emptyMessage: PropTypes.string,
        reducers: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            refresh: PropTypes.func.isRequired,
            fetch: PropTypes.func.isRequired
        }).isRequired,
        onLoadMore: PropTypes.func,
        onRefresh: PropTypes.func
    };

    static defaultProps = {
        separator: true
    };

    render() {

        const {
            reducers: {
                data = [],
                refreshing = false
            } = {},
            ...otherProps
        } = this.props;

        return (
            <FlatList
                {...otherProps}
                style                  = {_styles.container}
                data                   = {data}
                // refreshing             = {refreshing}
                // onRefresh              = {this._handleRefesh}
                onEndReached           = {this._handleLoadMore}
                ListEmptyComponent     = {this._ListEmptyComponent}
                ListFooterComponent    = {this._ListFooterComponent}
                ItemSeparatorComponent = {this._ItemSeparatorComponent}
                refreshControl         = {<RefreshControl 
                    refreshing         = {refreshing}
                    onRefresh          = {this._handleRefesh}
                />}
            />
        );
    }

    componentDidMount() {

        this.props.actions.fetch({
            page: 1,
            ...this.props.params
        });
    }

    _handleRefesh = (e) => {

        if (!this.props.reducers.loading) {

            this.props.actions.refresh();
            this.props.onRefresh && this.props.onRefresh(e);
        }
    };

    _handleLoadMore = (e) => {

        console.log('loadmore');
        if (!this.props.reducers.loading) {

            this.props.actions.fetch({
                page: this.props.reducers.page + 1,
                ...this.props.params
            });

            this.props.onLoadMore && this.props.onLoadMore(e);
        }
    };

    _ListEmptyComponent = () => {

        if (this.props.reducers.loading) {

            return null;
        }

        return (
            <Text style={_styles.message}>{this.props.emptyMessage || translate("list_message.empty_message")}</Text>
        );
    };

    _ListFooterComponent = () => {

        if( this.props.reducers.loading ) {

            return <ActivityIndicator style={_styles.loading}/>
        }
        return null;
    };

    _ItemSeparatorComponent = () => {

        if (!this.props.separator) {
            return null;
        }
        return (
            <View style={_styles.separator}/>
        );
    };
}

const _styles = {
    container: {
        flex: 1
    },
    separator: {
        width: "100%",
        height: sizes.separatorHeight,
        backgroundColor: colors.separatorBackgroundColor
    },
    message: {
        backgroundColor: colors.messageBackgroundColor,
        paddingVertical: 4 * scale,
        textAlign: 'center',
        fontSize: fontSizes.normal,
        color: colors.textSinkingColor
    },
    loading: {
        paddingVertical: 5 * scale
    }
};

export default ListBasic;