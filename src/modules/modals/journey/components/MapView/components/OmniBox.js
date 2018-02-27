"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from './SearchBar';
import ModalLocation from './ModalLocation';
import {scale, colors, fontSizes, hitSlop, shadow, sizes} from '~/configs/styles';

class OmniBox extends React.PureComponent {

    static displayName = "@OmniBox";

    static propTypes = {

    };

    static defaultProps = {

    };

    render() {

        const {
            children,
            ...otherProps
        } = this.props;

        return (
            <View pointerEvents="box-none" style={_styles.container}>
                <SearchBar
                    {...otherProps}
                >{children}</SearchBar>
                <ModalLocation />
            </View>
        );
    }
}

const _styles = {
    container: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
    }
};

export default OmniBox;