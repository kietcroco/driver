"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from './SearchBar';
import ModalLocation from './ModalLocation';
import {scale, colors, fontSizes, hitSlop, shadow, sizes} from '~/configs/styles';

class OmniBox extends React.Component {

    static displayName = "@OmniBox";

    static propTypes = {
        children: PropTypes.string,
        onLocationSelect: PropTypes.func
    };

    static defaultProps = {
        children: ""
    };

    constructor( props ) {
        super(props);

        this.state = {
            modalLocation: true,
            description: props.description,
            searchText: props.description
        };
    }

    componentWillReceiveProps( nextProps ) {

        if( this.props.children !== nextProps.children && nextProps.children !== this.state.description ) {

            this.setState({
                description: nextProps.children,
                searchText: nextProps.children
            });
        }
    }

    render() {

        const {
            children,
            ...otherProps
        } = this.props;

        return (
            <View pointerEvents="box-none" style={_styles.container}>
                <SearchBar
                    {...otherProps}
                    editable     = {false}
                    onPress      = {this._inputOnPress }
                    clearOnPress = { this._clearOnPress }
                >{this.state.description}</SearchBar>
                <ModalLocation
                    visible        = {this.state.modalLocation}
                    onRequestClose = { this._onRequestClose }
                    onSelect       = { this._onLocationSelect }
                    onChangeText   = { this._onChangeText }
                    searchText     = { this.state.searchText }
                />
            </View>
        );
    }

    _onChangeText = ( searchText = "" ) => {

        this.setState({
            searchText
        });
    };

    // sự kiện xóa input search
    _clearOnPress = () => {

        this.setState({
            description: "",
            searchText: "",
            modalLocation: false
        }, () => {

            this.props.onClear && this.props.onClear();
        });
    };

    // sự kiện nhấn input search
    _inputOnPress = () => {

        this.setState({
            modalLocation: true
        });
    };

    // sự kiện back modal
    _onRequestClose = () => {
        this.setState({
            modalLocation: false
        });
    };

    // sự kiện select location
    _onLocationSelect = geo => {

        this.setState({
            description: geo.description || geo.formatted_address || geo.vicinity || geo.name,
            modalLocation: false
        }, () => {

            this.props.onLocationSelect && this.props.onLocationSelect(geo);
        });
    };
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