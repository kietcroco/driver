"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, ScrollView } from 'react-native';
import SearchBar from '../SearchBar';
import { colors } from '~/configs/styles';
import SearchHistory from './SearchHistory';
import SearchResult from './SearchResult';
import SelectOnMap from './SelectOnMap';

class ModalLocation extends React.Component {

    static displayName = "@ModalLocation";

    static propTypes = {
        visible: PropTypes.bool,
        googleMapsClient: PropTypes.object,
        currentPosition: PropTypes.object,
        onSelect: PropTypes.func,
        coordinate: PropTypes.object,
        onMapSelect: PropTypes.func,
        onRequestClose: PropTypes.func,
        onChangeText: PropTypes.func
    };

    static defaultProps = {
        visible: false
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: props.searchText,
            currentPosition: props.currentPosition,
            modalSelectVisible: false
        };

        this.googleMapsClient = props.googleMapsClient || require("../../utils/createGoogleMapsClient").default();
    }

    componentWillReceiveProps(nextProps) {

        if( nextProps.searchText !== this.state.searchText ) {

            this.setState({
                searchText: nextProps.searchText
            });
        }

        // watch
        if (!this._watchID && typeof nextProps.currentPosition !== "object") {

            this._watchPosition();
        }

        if( 
            // !this._watchID
            typeof nextProps.currentPosition === "object"
            // && this.props.currentPosition !== nextProps.currentPosition 
            && nextProps.currentPosition != this.state.currentPosition 
        ) {

            if (this._watchID) {

                navigator.geolocation.clearWatch(this._watchID);
            }

            this.setState({
                currentPosition: nextProps.currentPosition
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.searchText !== nextState.searchText
            || this.state.currentPosition !== nextState.currentPosition
            || this.props.visible !== nextProps.visible
            || this.props.currentPosition !== nextProps.currentPosition
            || this.props.coordinate !== nextProps.coordinate
        );
    }

    render() {

        const {
            visible,
            onRequestClose,
            coordinate
        } = this.props;

        return (
            <Modal
                visible        = {visible}
                onRequestClose = {onRequestClose}
                transparent    = {true}
            >
                <View style={_styles.container}>
                    <SearchBar
                        // ref                 = {ref => (this.searchBar = ref)}
                        editable            = {true}
                        directionButton     = {false}
                        backButton          = {true}
                        onChangeText        = {this._searchOnChangeText}
                        clearOnPress        = {this._searchClearOnPress}
                        backOnPress         = {onRequestClose}
                        onRef               = { ref => (this.searchBar = ref) }
                    >{this.state.searchText}</SearchBar>

                    <ScrollView
                        style                          = { _styles.scrollView }
                        horizontal                     = {false}
                        onEndReachedThreshold          = {50}
                        keyboardDismissMode            = "on-drag"
                        keyboardShouldPersistTaps      = "handled"
                        showsHorizontalScrollIndicator = {false}
                        showsVerticalScrollIndicator   = {true}
                        directionalLockEnabled         = {true}
                    >
                        <SearchResult
                            input            = {this.state.searchText}
                            hasHistory       = { this._hasHistory }
                            onSelect         = { this._onSelect }
                            visible          = { !!this.state.searchText }
                            googleMapsClient = {this.googleMapsClient}
                            currentPosition  = { this.state.currentPosition }
                        />

                        <SearchHistory
                            ref              = {ref => this.searchHistory = ref}
                            onSelect         = { this._onSelect }
                            visible          = { !this.state.searchText }
                            googleMapsClient = {this.googleMapsClient}
                            currentPosition  = {this.state.currentPosition}
                        />

                        <SelectOnMap
                            currentPosition = {this.state.currentPosition}
                            visible         = {!!this.state.searchText}
                            onSubmit        = { this._onSelectOnMap }
                            coordinate      = {coordinate}
                        />
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    componentDidMount() {

        if( !this.props.currentPosition ) {

            this._watchPosition();
        } 
        
        // focus input
        if( this.props.visible ) {

            this.searchBar && this.searchBar.focus();
        }

        this._isUnmount = false;
    }

    componentDidUpdate( prevProps ) {

        // focus input
        if (prevProps.visible !== this.props.visible && this.props.visible) {

            this.searchBar && this.searchBar.focus();
        }
    }

    componentWillUnmount() {

        if (this._watchID) {

            navigator.geolocation.clearWatch(this._watchID);
        }

        this._isUnmount = true;
    }

    // sự kiện chọn vị trí từ map
    _onSelectOnMap = ( coords = {} ) => {
        
        // tạo chuỗi search text từ coords
        let searchText = coords.name || `${coords.latitude}, ${coords.longitude}`;
        this.setState({
            searchText
        }, () => {

            this.props.onChangeText && this.props.onChangeText(searchText);
            this.props.onMapSelect && this.props.onMapSelect(coords);
        });
    };

    // sự kiện nhập input search
    _searchOnChangeText = (searchText = "") => {

        this.setState({
            searchText
        }, () => {

            this.props.onChangeText && this.props.onChangeText(searchText);
        });
    };

    // sự kiện nhấn nút xoá search
    _searchClearOnPress = () => {

        this.setState({
            searchText: ""
        }, () => {

            this.props.onChangeText && this.props.onChangeText("");
        });
    };

    // hàm kiểm tra place id có trong history không
    _hasHistory = (place_id) => {

        let result = this.searchHistory && this.searchHistory.getSource(place_id);

        if( result ) {

            if( Array.isArray(result) ) {

                return !!result.length;
            }
            return true;
        }

        return result;
    };

    // sự kiện chọn location trên list
    _onSelect = (geoResult) => {

        // lưu cache
        if(this.searchHistory) {

            this.searchHistory.syncHistoryCache(geoResult);
        }

        this.props.onSelect && this.props.onSelect(geoResult);
    };

    // hàm lấy vị trí hiện tại
    _watchPosition = async () => {

        try {

            this._watchID = await require('../../utils/watchPosition').default(
                position => {

                    if (
                        !this._isUnmount &&
                        position &&
                        position.coords
                    ) {

                        this.setState({
                            currentPosition: position.coords
                        });
                    }
                }
            );
        } catch (error) { }
    };
}

const _styles = {
    container: {
        flex: 1,
        backgroundColor: colors.mapModalBackgroundColor
    },
    scrollView: {
        flex: 1
    }
};

export default ModalLocation;