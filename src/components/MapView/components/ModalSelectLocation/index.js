"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import MapView from 'react-native-maps';
import { initialRegion, LATITUDE_DELTA, LONGITUDE_DELTA, initialCoordinate } from '~/configs/map';
import Header from './Header';
import CurrentLocationButton from '../CurrentLocationButton';

class ModalSelectLocation extends React.PureComponent {

    static displayName = "@ModalSelectLocation";

    static propTypes = {
        currentPosition: PropTypes.object,
        onSubmit: PropTypes.func,
        visible: PropTypes.bool,
        coordinate: PropTypes.object,
        onRegionChange: PropTypes.func
    };

    static defaultProps = {
        visible: false,
        coordinate: undefined,
        cacheEnabled: false,
        loadingEnabled: false,
        initialRegion: initialRegion
    };

    constructor(props) {
        super(props);

        this._region = props.region || initialRegion;
        this._coordinate = props.coordinate || props.currentPosition || initialCoordinate;
    }

    render() {

        const {
            visible,
            onRequestClose,
            onRef,
            region,
            currentPosition,
            ...otherProps
        } = this.props;

        return (
            <Modal
                visible        = {visible}
                onRequestClose = {onRequestClose}
                transparent    = {true}
            >
                <Header
                    backOnPress   = {onRequestClose}
                    submitOnPress = {this._submit}
                />
                    
                <MapView
                    {...otherProps}
                    provider              = {MapView.PROVIDER_GOOGLE}
                    style                 = {_styles.mapView}
                    onRegionChange        = { this._onRegionChange }
                    showsMyLocationButton = {false}
                    onPoiClick            = { this._onPoiClick }
                    ref                   = { ref => {
                        onRef && onRef(ref);
                        this.map = ref;
                    } }
                    onMapReady            = {this._onMapReady }
                >
                    <MapView.Marker
                        coordinate={initialCoordinate}
                        ref = { ref => {

                            this.marker = ref;
                        } }
                    />
                </MapView>

                <CurrentLocationButton
                    onCurrentPosition = {this._onCurrentPosition}
                    currentPosition   = {currentPosition}
                />
            </Modal>
        );
    }

    componentDidMount() {

        this._isUnmount = false;
    }
    
    componentWillUnmount() {

        this._isUnmount = true;
    }

    // khi map đã khởi tạo
    _onMapReady = () => {

        this._setMarker(this._coordinate);
        this._setRegion({
            ...this._region,
            ...this._coordinate,
            latitudeDelta: LATITUDE_DELTA * 1,
            longitudeDelta: LONGITUDE_DELTA * 1
        });
    };

    // hàm thay đổi khung map
    _onRegionChange = (region = {}) => {

        this._setMarker(region);

        this._region = region;
        this.props.onRegionChange && this.props.onRegionChange(region);
    };

    // sự kiện click vào các điểm trên map
    _onPoiClick = (e) => {

        const {
            coordinate,
            name,
            placeId
        } = e.nativeEvent;

        const region = {
            ...this._region,
            ...coordinate
        };

        this.props.onPoiClick && this.props.onPoiClick(e);
        
        this._setMarker({
            ...coordinate,
            name,
            place_id: placeId
        });
        this._setRegion(region);

        this.props.onRegionChange && this.props.onRegionChange(region);
    };

    // sự kiện nhấn OK
    _submit = () => {

        this.props.onSubmit && this.props.onSubmit(this._coordinate);
    };

    // sự kiện click vào nút lấy vị trí hiện tại
    _onCurrentPosition = (coordinate) => {

        coordinate = coordinate || this.props.currentPosition;
        
        if( this._isUnmount ) {

            return;
        }

        const region = {
            ...coordinate,
            latitudeDelta: LATITUDE_DELTA * 1,
            longitudeDelta: LONGITUDE_DELTA * 1
        };

        this._setMarker(coordinate);
        this._setRegion(region);
    };

    _setMarker = (coordinate = {}) => {

        coordinate = {
            ...coordinate,
            latitude: coordinate.latitude * 1,
            longitude: coordinate.longitude * 1
        };

        this._coordinate = coordinate;
        if (this.marker && this.marker.marker) {

            this.marker.marker.setNativeProps({
                coordinate: coordinate
            });
        }
    };

    // hàm set lại khu vực
    _setRegion = (region = {}) => {
        
        region = {
            ...region,
            latitude: region.latitude * 1,
            longitude: region.longitude * 1,
            latitudeDelta: region.latitudeDelta * 1,
            longitudeDelta: region.longitudeDelta * 1
        };

        this._region = region;

        if (this.map && this.map.map) {

            this.map.map.setNativeProps({
                region: region
            });
        }

        this.props.onRegionChange && this._region !== this.props.region && this.props.onRegionChange(region);
    };
}

const _styles = {
    mapView: {
        flex: 1
    }
};

export default ModalSelectLocation;