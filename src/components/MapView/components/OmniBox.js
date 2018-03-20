"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import SearchBar from './SearchBar';
import ModalLocation from './ModalLocation';

class OmniBox extends React.Component {

    static displayName = "@OmniBox";

    static propTypes = {
        children: PropTypes.string,
        onLocationSelect: PropTypes.func,
        coordinate: PropTypes.object,
        onLocationMapSelect: PropTypes.func,
        onChangeText: PropTypes.func,
        onClear: PropTypes.func,
        currentPosition: PropTypes.object,
        googleMapsClient: PropTypes.object
    };

    static defaultProps = {
        children: "",
        coordinate: undefined
    };

    constructor( props ) {
        super(props);

        this.state = {
            modalLocation: false,
            description: props.description,
            searchText: props.description,
            coordinate: props.coordinate
        };
    }

    componentWillReceiveProps( nextProps ) {

        let searchText = this.state.searchText;
        // nếu có thay đổi search text thì set lại state
        if( this.props.children !== nextProps.children && nextProps.children !== this.state.description ) {

            searchText = nextProps.children;
            this.setState({
                description: nextProps.children,
                searchText: nextProps.children
            });
        }

        // nếu search text là coords thì set lại coords
        if ( regxLatlng.test(searchText) ) {

            let match = `${searchText}`.match(regxLatlng);
            if (match && match.length == 3) {

                this.setState({
                    coordinate: {
                        latitude: match[1],
                        longitude: match[2]
                    }
                });
                return;
            }
        } 
        
        if( 
            this.props.coordinate !== nextProps.coordinate 
            && nextProps.coordinate !== this.state.coordinate
        ) {

            this.setState({
                coordinate: nextProps.coordinate
            });
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {

        return (
            this.state.searchText !== nextState.searchText
            || this.state.description !== nextState.description
            || this.state.modalLocation !== nextState.modalLocation
            || this.state.coordinate !== nextState.coordinate
            || this.props.children !== nextProps.children
            || this.props.currentPosition !== nextProps.currentPosition
        );
    }

    render() {

        const {
            children,
            currentPosition,
            googleMapsClient,
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
                    visible          = {this.state.modalLocation}
                    onRequestClose   = { this._onRequestClose }
                    onSelect         = { this._onLocationSelect }
                    onChangeText     = { this._onChangeText }
                    searchText       = { this.state.searchText }
                    coordinate       = {this.state.coordinate}
                    onMapSelect      = {this._onMapSelect }
                    currentPosition  = {currentPosition}
                    googleMapsClient = {googleMapsClient}
                />
            </View>
        );
    }

    // sự kiện select location
    _onLocationSelect = (geo = {}) => {

        // chuỗi search text: địa chỉ
        let description = geo.description || geo.formatted_address || geo.vicinity || geo.name; 

        // lấy coords từ geo result
        let coordinate = undefined;

        const {
            geometry: {
                location
            } = {}
        } = geo;

        if (location) {

            coordinate = {
                latitude: location.lat,
                longitude: location.lng,
                description
            };
        }

        this.setState({
            description,
            modalLocation: false,
            coordinate
        }, () => {

            this.props.onLocationSelect && this.props.onLocationSelect(geo);
        });
    };

    // hàm chọn vị trí từ map
    _onMapSelect = ( coords = {} ) => {

        // tạo chuỗi search text: coords
        let description = coords.description 
                    || coords.formatted_address 
                    || coords.vicinity 
                    || coords.name
            || `${coords.latitude}, ${coords.longitude}`
        ; 

        this.setState({
            coordinate: coords,
            modalLocation: false,
            description
        }, () => {
            
            this.props.onLocationMapSelect && this.props.onLocationMapSelect(coords);
        });
    };

    // sự kiện nhập input search
    _onChangeText = (searchText = "") => {

        this.setState({
            searchText
        }, () => {

            this.props.onChangeText && this.props.onChangeText(searchText);
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
}

// regex lấy coords từ search text
const regxLatlng = /^[\s\t\n\r]*(\d+\.?\d+)\,[\s\t\n\r]*(\d+\.?\d+)[\s\t\n\r]*$/;

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