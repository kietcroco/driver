"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MapViewBase from 'react-native-maps';
import extendExports from '~/library/extendExports';
import OmniBox from './components/OmniBox';
import { LATITUDE_DELTA, LONGITUDE_DELTA, initialCoordinate, initialRegion } from '~/configs/map';
import shallowEqual from 'fbjs/lib/shallowEqual';
import CurrentLocationButton from './components/CurrentLocationButton';

class MapView extends React.Component {

    static displayName = "@MapView";

    static propTypes = {
        currentPosition: PropTypes.object,
        onRef: PropTypes.func,
        region: PropTypes.object,
        searchBar: PropTypes.bool,
        googleMapsClient: PropTypes.object
    };

    static defaultProps = {
        showsUserLocation: false,
        followsUserLocation: false,
        showsMyLocationButton: false,
        cacheEnabled: false,
        loadingEnabled: false,
        initialRegion: initialRegion,
        searchBar: false
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPosition: props.currentPosition || initialCoordinate,
            selectMarker: []
        };

        // this.googleMapsClient = props.googleMapsClient || require("./utils/createGoogleMapsClient").default();

        this._watchID = undefined;
        this._isManipulating = false;
        this._currentRegion = props.region || initialRegion;
        this._isReady = false;
    }

    componentWillReceiveProps(nextProps) {

        if( 
            nextProps.currentPosition 
            && this.props.currentPosition !== nextProps.currentPosition 
            && nextProps.currentPosition !== this.state.currentPosition
        ) {

            this.setState({
                currentPosition: nextProps.currentPosition
            });
        } else if( 
            this.props.currentPosition 
            && !nextProps.currentPosition 
            && (nextProps.showsUserLocation || nextProps.followsUserLocation)
        ) {

            this.setState({
                currentPosition: this.state.currentPosition || initialCoordinate
            });
            if (!this._watchID) {

                this._watchPosition();
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.selectMarker !== nextState.selectMarker
            || this.state.currentPosition !== nextState.currentPosition
            || !shallowEqual(this.props, nextProps)
        );
    }

    render() {

        const {
            style,
            children,
            onRef,
            showsMyLocationButton,
            region,
            searchBar,
            googleMapsClient,
            ...otherProps
        } = this.props;

        let searchText = "";
        if (this.state.selectMarker[0]) {

            searchText = this.state.selectMarker[0].description || `${this.state.selectMarker[0].latitude}, ${this.state.selectMarker[0].longitude}`;
        }

        return (
            <View style={_styles.container}>
                {
                    searchBar &&
                        <OmniBox
                            onLocationSelect    = { this._onLocationSelect }
                            onLocationMapSelect = {this._onLocationMapSelect }
                            onClear             = { this._onClear }
                            coordinate          = {this.state.selectMarker[0]}
                            currentPosition     = {this.state.currentPosition}
                            googleMapsClient    = {googleMapsClient}
                        >{searchText}</OmniBox>
                }
                <MapViewBase
                    provider              = {MapViewBase.PROVIDER_GOOGLE}
                    {...otherProps}
                    style                 = {_styles.mapView}
                    onLongPress           = {this._onLongPress}
                    onPoiClick            = {this._onPoiClick}
                    showsMyLocationButton = {false}
                    onMapReady            = {this._onMapReady }
                    ref                   = { ref => {
                        onRef && onRef(ref);
                        this.map = ref;
                    } }
                >
                    {children}
                    {
                        !!this.state.selectMarker.length &&
                            this.state.selectMarker.map( (coord, i) => {

                                if( !coord ) {

                                    return null;
                                }
                                return (
                                    <MapViewBase.Marker
                                        key = {`select-marker-${i}`}
                                        coordinate={coord}
                                    />
                                );
                            } )
                    }
                </MapViewBase>

                {
                    showsMyLocationButton && 
                        <CurrentLocationButton 
                            currentPosition   = { this.state.currentPosition }
                            onCurrentPosition = { this._onCurrentPosition }
                        />
                }
            </View>
        );
    }

    componentDidMount() {

        if (this.props.showsUserLocation || this.props.followsUserLocation) {

            if ( !this.props.currentPosition ) {

                this._watchPosition();
            }
        }
    }

    componentWillUnmount() {

        if( this._watchID ) {

            navigator.geolocation.clearWatch(this._watchID);
            this._watchID = undefined;
        }
    }

    _onMapReady = (e) => {

        this._isReady = true;
        if (this.props.showsUserLocation || this.props.followsUserLocation) {

            this._setRegion({
                ...this.state.currentPosition,
                latitudeDelta: LATITUDE_DELTA * 1,
                longitudeDelta: LONGITUDE_DELTA * 1
            });
        } else {

            this._setRegion(this._currentRegion);
        }
        this.props.onMapReady && this.props.onMapReady(e);
    };

    // hàm set lại khu vực
    _setRegion = (region = {}) => {

        region = {
            ...region,
            latitude: (region.latitude || this._currentRegion.latitude) * 1,
            longitude: (region.longitude || this._currentRegion.longitude) * 1,
            latitudeDelta: (region.latitudeDelta || this._currentRegion.latitudeDelta) * 1,
            longitudeDelta: (region.longitudeDelta || this._currentRegion.longitudeDelta) * 1
        };

        this._currentRegion = region;

        if (this.map && this.map.map) {

            this.map.map.setNativeProps({
                region: region
            });
        }

        this.props.onRegionChange && this.props.onRegionChange(region);
    };

    // hàm lấy vị trí hiện tại
    _watchPosition = async () => {

        try {

            this._watchID = await require("./utils/watchPosition").default(
                position => {
                    if (
                        position &&
                        position.coords
                    ) {

                        this.setState({
                            currentPosition: position.coords
                        }, () => {

                            if (this._isReady && this.props.showsUserLocation) {

                                this._setRegion({
                                    ...position.coords,
                                    latitudeDelta: LATITUDE_DELTA * 1,
                                    longitudeDelta: LONGITUDE_DELTA * 1
                                });
                            }

                            if (!this._isManipulating) {
    
                                if (this.props.followsUserLocation) {
    
                                    this._setRegion({
                                        ...position.coords,
                                        latitudeDelta: LATITUDE_DELTA * 1,
                                        longitudeDelta: LONGITUDE_DELTA * 1
                                    });
                                }
                            }
                        });
                    }
                }
            );

        } catch (error) { }
    };

    // sự kiện xoá tìm kiếm
    _onClear = () => {

        // xoá marker
        this._clearSelectMarker();

        if( this.props.followsUserLocation || this.props.showsUserLocation ) {

            // set region về vị trí hiện tại
            this._setRegion({
                latitude: this.state.currentPosition.latitude * 1,
                longitude: this.state.currentPosition.longitude * 1,
                latitudeDelta: LATITUDE_DELTA * 1,
                longitudeDelta: LONGITUDE_DELTA * 1
            });
        } 
        else if( this.props.currentPosition || this._watchID ) {

            // set region về vị trí hiện tại
            this._setRegion({
                latitude: this.state.currentPosition.latitude * 1,
                longitude: this.state.currentPosition.longitude * 1,
                latitudeDelta: this._currentRegion.latitudeDelta * 1,
                longitudeDelta: this._currentRegion.longitudeDelta * 1
            });
        } else {

            // set region về vị trí hiện tại
            this._setRegion(initialRegion);
        }
    };

    // sự kiện click vào vị trí hiện tại
    _onCurrentPosition = (coordinate = {}) => {

        if( this.props.showsUserLocation ) {

            // set region
            this._setRegion({
                ...coordinate,
                latitudeDelta: LATITUDE_DELTA * 1,
                longitudeDelta: LONGITUDE_DELTA * 1
            });
        } else {

            // set marker
            this._selectMarker({
                ...coordinate,
                description: translate("maps.current_location")
            }, () => {
    
                // set region
                this._setRegion({
                    ...coordinate,
                    latitudeDelta: LATITUDE_DELTA * 1,
                    longitudeDelta: LONGITUDE_DELTA * 1
                });
            });
        }

    };

    // sự kiện chọn vị trí từ modal location
    _onLocationSelect = ( geo = {} ) => {

        const {
            description,
            geometry: {
                location
            } = {}
        } = geo;

        // set marker
        this._selectMarker({
            latitude: location.lat,
            longitude: location.lng,
            description
        }, () => {

            // set region
            this._setRegion({
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: LATITUDE_DELTA * 1,
                longitudeDelta: LONGITUDE_DELTA * 1
            });
        });
    };

    // sự kiện chọn vị trí từ map
    _onLocationMapSelect = ( coords = {} ) => {

        // set marker
        this._selectMarker({
            ...coords,
            latitude: coords.latitude * 1,
            longitude: coords.longitude * 1,
            description: coords.name
        }, () => {

            // set region
            this._setRegion({
                latitude: coords.latitude * 1,
                longitude: coords.longitude * 1,
                latitudeDelta: LATITUDE_DELTA * 1,
                longitudeDelta: LONGITUDE_DELTA * 1
            });
        });

    };

    // hàm xoá marker (vị trí O)
    _clearSelectMarker = () => {

        const selectMarker = this.state.selectMarker.slice();
        selectMarker[0] = undefined;
        this._isManipulating = false;

        this.setState({
            selectMarker
        });
    };

    // sự kiện click vào vị trí trên map
    _onPoiClick = (e) => {

        const {
            coordinate,
            name,
            placeId
        } = e.nativeEvent;

        this._selectMarker({
            ...coordinate,
            place_id: placeId,
            description: name
        });

        this.props.onPoiClick && this.props.onPoiClick(e);
    };

    // sự kiện hold
    _onLongPress = (e) => {

        this._selectMarker({
            ...e.nativeEvent.coordinate
        });
        this.props.onLongPress && this.props.onLongPress(e);
    };

    // hàm hỗ trợ set marker (vị trí O)
    _selectMarker = (coords, callback) => {

        this._isManipulating = true;

        const selectMarker = this.state.selectMarker.slice();
        selectMarker[0] = coords;

        this.setState({
            selectMarker
        }, callback);
    };
}

const _styles = {
    container: {
        flex: 1
    },
    mapView: {
        flex: 1
    }
};


export default MapView;
// extends all static
module.exports = extendExports(MapView, MapViewBase);