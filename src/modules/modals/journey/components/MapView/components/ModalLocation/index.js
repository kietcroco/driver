"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Modal, ScrollView } from 'react-native';
import SearchBar from '../SearchBar';
import { colors } from '~/configs/styles';
//import SectionBox from '~/components/SectionBox';
import SearchHistory from './SearchHistory';
import SearchResult from './SearchResult';
import I18n from '~/library/i18n/I18n';
import { createClient } from '~/library/googlemaps';
import { google_api_key, types as placeTypes } from '~/configs/map';
import Permissions from 'react-native-permissions';
import SelectOnMap from './SelectOnMap';

class ModalLocation extends React.Component {

    static displayName = "@ModalLocation";

    static propTypes = {
        visible: PropTypes.bool,
        googleMapsClient: PropTypes.object,
        currentPosition: PropTypes.object,
        onSelect: PropTypes.func
    };

    static defaultProps = {
        visible: false
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            currentPosition: undefined,
            modalSelectVisible: false
        };

        this.googleMapsClient = props.googleMapsClient || createClient({
            key: google_api_key,
            language: I18n.locale
        });
    }

    componentWillReceiveProps(nextProps) {

        if( this.props.searchText !== nextProps.searchText && nextProps.searchText !== this.state.searchText ) {

            this.setState({
                searchText: nextProps.searchText
            });
        }

        if( 
            !this._watchID
            && typeof nextProps.currentPosition === "object"
            && this.props.currentPosition !== nextProps.currentPosition 
            && nextProps.currentPosition != this.state.currentPosition 
        ) {

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
        );
    }

    render() {

        const {
            visible,
            onRequestClose
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
                    >
                        {this.state.searchText}
                    </SearchBar>
                    <ScrollView
                        style                          = { _styles.scrollView }
                        renderRow                      = {this._renderRow}
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
        
        if( this.props.visible ) {

            this.searchBar && this.searchBar.focus();
        }
    }

    componentDidUpdate( prevProps ) {

        if (prevProps.visible !== this.props.visible && this.props.visible) {

            this.searchBar && this.searchBar.focus();
        }
    }

    componentWillUnmount() {

        if (this._watchID) {

            navigator.geolocation.clearWatch(this._watchID);
        }
    }

    // hàm lấy vị trí hiện tại
    _watchPosition = async () => {

        try {
            
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            let statuses = await Permissions.check('location');

            if (statuses == "undetermined") {

                // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                statuses = await Permissions.request('location');
            }

            if (statuses == "authorized") {
                
                this._watchID = navigator.geolocation.watchPosition(
                    position => {

                        if(
                            position &&
                            position.coords
                        ) {

                            this.setState({
                                currentPosition: position.coords
                            });
                        }
                    },
                    error => {},
                    {
                        timeout: 30000, 
                        maximumAge: 200, 
                        enableHighAccuracy: true, 
                        distanceFilter: 100, 
                        // useSignificantChanges: true
                    }
                );
            }
        } catch (error) {}
    };

    // sự kiện nhập input search
    _searchOnChangeText = searchText => {

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

    // sự kiện chọn location
    _onSelect = (geoResult) => {

        // lưu cache
        if(this.searchHistory) {

            this.searchHistory.syncHistoryCache(geoResult);
        }

        this.props.onSelect && this.props.onSelect(geoResult);
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