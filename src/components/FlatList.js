"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { FlatList as List } from 'react-native';

class FlatList extends React.PureComponent {

    static displayName = "@FlatList";

    static propTypes = List.propTypes;

    constructor( props ) {
        super( props );

        this.onEndReachedCalledDuringMomentum = true;
    }

    render() {

        const {
            style,
            onEndReachedThreshold,
            children,
            onRef,
            ...otherProps
        } = this.props;

        return (
            <List
                {...otherProps}
                ref                   = {(ref) => onRef && onRef(ref) }
                style                 = {style || _styles.container}
                onEndReachedThreshold = {onEndReachedThreshold || 0.5}
                onEndReached          = {this._onEndReached}
                onMomentumScrollBegin = {this._onMomentumScrollBegin}
            >{children}</List>
        );
    }

    _onMomentumScrollBegin = (e) => {

        this.onEndReachedCalledDuringMomentum = false;
        this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(e);
    };

    _onEndReached = (e) => {

        if (!this.onEndReachedCalledDuringMomentum) {

            this.props.onEndReached && this.props.onEndReached(e);
            this.onEndReachedCalledDuringMomentum = true;
        }
    };
}

const _styles = {
    container: {
        flex: 1
    }
};

export default FlatList;