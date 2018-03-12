"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import MapViewBase from 'react-native-maps';
import { initialRegion } from '~/configs/map';
import extendExports from '~/library/extendExports';
import OmniBox from './components/OmniBox';
import I18n from '~/library/i18n/I18n';
import { createClient } from '~/library/googlemaps';
import { google_api_key, types as placeTypes, LATITUDE_DELTA, LONGITUDE_DELTA } from '~/configs/map';
import Permissions from 'react-native-permissions';

class MapView extends React.Component {

    static displayName = "@MapView";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            region: initialRegion,
            marker: [],
            selectMarker: []
        };

        this.googleMapsClient = props.googleMapsClient || createClient({
            key: google_api_key,
            language: I18n.locale
        });

        this._watchID = undefined;
        this._isManipulating = false;
        this._currentCoord = initialRegion;
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        const {
            style,
            children,
            ...otherProps
        } = this.props;

        return (
            <View style={_styles.container}>
                <OmniBox
                    onLocationSelect = { this._onLocationSelect }
                    onClear = { this._onClear }
                ></OmniBox>
                <MapViewBase
                    {...otherProps}
                    provider={MapViewBase.PROVIDER_GOOGLE}
                    style={_styles.mapView}
                    initialRegion={initialRegion}
                    region={this.state.region}
                    onLongPress={this._onLongPress}
                    onPress = {this._onPress}
                    
                    showsUserLocation = {true}
                    followsUserLocation = {true}
                    showsMyLocationButton = {true}
        
                    cacheEnabled = {true}
                    loadingEnabled={true}
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
            </View>
        );
    }

    componentDidMount() {

        this._watchPosition();
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

                        if (
                            position &&
                            position.coords
                        ) {

                            this._currentCoord = position.coords;

                            if( !this._isManipulating ) {

                                this.setState({
                                    region: {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA
                                    }
                                });
                            }
                        }
                    },
                    error => { },
                    {
                        timeout: 30000,
                        maximumAge: 200,
                        enableHighAccuracy: true,
                        distanceFilter: 10,
                        // useSignificantChanges: true
                    }
                );
            }
        } catch (error) { }
    };

    _onClear = () => {

        this._clearSelectMarker();

        this.setState({
            region: {
                latitude: this._currentCoord.latitude,
                longitude: this._currentCoord.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
        this._isManipulating = false;
    };

    _onLocationSelect = ( geo = {} ) => {

        const {
            geometry: {
                location
            } = {}
        } = geo;

        this._selectMarker({
            latitude: location.lat,
            longitude: location.lng
        });

        this.setState({
            region: {
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
    };

    _clearSelectMarker = () => {

        const selectMarker = this.state.selectMarker.slice();
        selectMarker[0] = undefined;

        this.setState({
            selectMarker
        });
    };

    _selectMarker = (coords) => {

        this._isManipulating = true;

        const selectMarker = this.state.selectMarker.slice();
        selectMarker[0] = coords;

        this.setState({
            selectMarker
        });
    };

    _onPress = (e) => {

        this._clearSelectMarker();
        this._isManipulating = false;

        this.googleMapsClient.reverseGeocode( {
            language: I18n.locale,
            latlng: e.nativeEvent.coordinate
        }, (e, res) => {
  
            if (!e && res.status == 200 && res.json.status == "OK" && res.json.results.length ) {

                const geo = res.json.results.find( geo => {

                    return (
                        geo.types.includes("establishment") 
                        || geo.types.includes("bus_station") 
                        || geo.types.includes("point_of_interest")
                        || geo.types.includes("floor")
                        || geo.types.includes("parking")
                        || geo.types.includes("post_box")
                        || geo.types.includes("postal_town")
                        || geo.types.includes("room")
                        || geo.types.includes("train_station")
                        || geo.types.includes("transit_station")
                        || geo.types.includes("premise")
                        || geo.types.includes("subpremise")
                        || geo.types.includes("airport")
                        || geo.types.includes("park")
                    )
                } );

                if(geo) {

                    const {
                        geometry: {
                            location
                        } = {}
                    } = geo;

                    this._selectMarker({
                        latitude: location.lat,
                        longitude: location.lng
                    });
                }
            }
        } );
        this.props.onPress && this.props.onPress(e);
    };

    _onLongPress = (e) => {

        this._selectMarker({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
        });
        this.props.onLongPress && this.props.onLongPress(e);
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