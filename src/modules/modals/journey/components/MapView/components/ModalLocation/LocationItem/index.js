"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import LocationView from './LocationView';
import { sizes, colors } from '~/configs/styles';
import I18n from '~/library/i18n/I18n';
import { createClient } from '~/library/googlemaps';
import { google_api_key, types as placeTypes } from '~/configs/map';

class LocationItem extends React.Component {

    static displayName = "@LocationItem";

    static propTypes = {
        source: PropTypes.object.isRequired,
        onSelect: PropTypes.func,
        googleMapsClient: PropTypes.object,
        currentPosition: PropTypes.object,
        isTyping: PropTypes.bool
    };

    static defaultProps = {
        isTyping: false
    };

    constructor( props ) {
        super( props );

        this.googleMapsClient = props.googleMapsClient || createClient({
            key: google_api_key,
            language: I18n.locale
        });

        this._taskPlace = [];

        this.state = {
            distance: ""
        };
    }

    componentWillReceiveProps( nextProps ) {

        if (!nextProps.isTyping && nextProps.currentPosition ) {

            this.calculatorDistance(nextProps.currentPosition);
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return (
            this.props.isTyping !== nextProps.isTyping
            || this.props.currentPosition !== nextProps.currentPosition
            || this.state.distance !== nextState.distance
            || this.props.source !== nextProps.source
        );
    }

    render() {

        const {
            source,
            icon
        } = this.props;

        return (
            <TouchableOpacity 
                style           = {_style}
                onPress         = {this._onPress}
                activeOpacity   = {colors.activeOpacity}
            >
                <Icon name={icon || (source.isHistory ? "history" : "place")} distance={this.state.distance}/>
                <LocationView source={source}/>
            </TouchableOpacity>
        );
    }

    componentDidMount() {

        if( !this.props.isTyping && this.props.currentPosition ) {

            this.calculatorDistance(this.props.currentPosition);
        }
    }

    componentWillUnmount() {

        this.stopRequestGetPlace();
    }

    _onPress = async () => {

        if( this._waitingPress ) {
            return;
        }
        this._waitingPress = true;
        try {
            
            const placeDetail = await this.getPlace(this.props.source.place_id);
            this.props.onSelect && this.props.onSelect({
                ...this.props.source,
                ...placeDetail
            });
        } catch (e) {

            e.message && toast(e.message);
        }

        this._waitingPress = false;
    };

    // hàm tính khoản cách
    calculatorDistance = async (position) => {

        try {

            var task = this.getDistance(position, this.props.source.place_id);
            const taskID = this._taskPlace.length;
            this._taskPlace[taskID] = task;

            const result = await task;
            this._taskPlace.splice(taskID, 1);
            task = undefined;

            if( result ) {

                this.setState({
                    distance: result.text
                });
            } else {

                this.setState({
                    distance: undefined
                });
            }
        } catch (e) {

            // e.message && toast(e.message);
        }
    };

    

    // hàm lấy position từ place_id
    /*
        address_components,
        formatted_address,
        name,
        place_id,
        types,
        url,
        geometry,
        vicinity
    */
    getPlace = async (place_id) => {

        var task = this._createRequestTaskPlace(place_id);
        const taskID = this._taskPlace.length;
        this._taskPlace[taskID] = task;

        const result = await task;
        this._taskPlace.splice(taskID, 1);
        task = undefined;

        return result;
    };

    // hàm lấy vị trí gần đó từ location
    /*
        geometry,
        name,
        place_id,
        types,
        vicinity
    */
    getPlaceNearby = async (location) => {

        var task = this._createRequestPlacesNearby(location);
        const taskID = this._taskPlace.length;
        this._taskPlace[taskID] = task;

        const result = await task;
        this._taskPlace.splice(taskID, 1);
        task = undefined;

        return result;
    };

    getDistance = (start, end) => {

        var isCancel = false;
        var task;

        const _result = new Promise(async (resolve, reject) => {

            try {

                if (isCancel) {

                    task = undefined;
                    return reject(new Error(isCancel));
                }

                let startIsString = typeof start === "string";
                let endIsString = typeof end === "string";
                let startLat = startIsString ? null : ((start.lat !== undefined && start.lat) || start.latitude);
                let startLng = startIsString ? null : ((start.lng !== undefined && start.lng) || start.longitude);
                let endLat = endIsString ? null : ((end.lat !== undefined && end.lat) || end.latitude);
                let endLng = endIsString ? null : ((end.lng !== undefined && end.lng) || end.longitude);
                // let startPlaceID;
                // let endPlaceID;

                // trường hợp 2 điểm bằng nhau
                // if (
                //     startIsString && endIsString && start == end
                //     || (`${startLat}` == `${endLat}` && `${startLng}` == `${endLng}`)
                // ) {

                // }

                if (startIsString) {

                    start = await this.getPlace(start);
                    if (isCancel) {

                        task = undefined;
                        return reject(new Error(isCancel));
                    }
                    if (start) {
                        startLat = start.geometry && start.geometry.location && start.geometry.location.lat;
                        startLng = start.geometry && start.geometry.location && start.geometry.location.lng;
                        // startPlaceID = start.place_id;
                    }
                }
                // else {

                //     start = await this.getPlaceNearby(start);
                // if (isCancel) {

                //     task = undefined;
                //     return reject(new Error(isCancel));
                // }
                //     if (start) {
                //         startLat = start.geometry && start.geometry.location && start.geometry.location.lat;
                //         startLng = start.geometry && start.geometry.location && start.geometry.location.lng;
                //         startPlaceID = start.place_id;
                //     }
                // }

                if (endIsString) {

                    end = await this.getPlace(end);
                    if (isCancel) {

                        task = undefined;
                        return reject(new Error(isCancel));
                    }
                    if (end) {
                        endLat = end.geometry && end.geometry.location && end.geometry.location.lat;
                        endLng = end.geometry && end.geometry.location && end.geometry.location.lng;
                        // endPlaceID = end.place_id;
                    }
                }
                // else {

                //     end = await this.getPlaceNearby(end);
                // if (isCancel) {

                //     task = undefined;
                //     return reject(new Error(isCancel));
                // }
                //     if (end) {
                //         endLat = end.geometry && end.geometry.location && end.geometry.location.lat;
                //         endLng = end.geometry && end.geometry.location && end.geometry.location.lng;
                //         endPlaceID = end.place_id;
                //     }
                // }

                task = this._createRequestDistance(
                    { lat: startLat, lng: startLng }, { lat: endLat, lng: endLng }
                );

                const result = await task;
                if (isCancel) {

                    task = undefined;
                    return reject(new Error(isCancel));
                }
                task = undefined;

                resolve(result);

            } catch (e) {
                reject(e);
            }
        });

        _result.cancel = (message) => {

            isCancel = message || "canceled";
            task && task.cancel && task.cancel(message);
            task = undefined;
        };

        return _result;
    };

    // hàm huỷ request
    stopRequestGetPlace = () => {

        try {

            if (this._taskPlace && this._taskPlace.length) {

                this._taskPlace.forEach( task => {

                    task && task.cancel && task.cancel();
                } );
                this._taskPlace = [];
            }
        } catch (e) { }
    };
    
    // hàm tạo request google api
    /*
        address_components,
        formatted_address,
        name,
        place_id,
        types,
        url,
        geometry,
        vicinity
    */
    _createRequestTaskPlace = async (placeid) => {

        const cacheKey = `place-detail-${placeid}`;
        var isCancel = false;
        var task;

        const _result = new Promise( async (resolve, reject) => {

            if (isCancel) {

                task = undefined;
                return reject(new Error(isCancel));
            }

            try {

                // cache adapter
                var HistoryCache = CacheManager.resolve('location-history');

                // nếu có cache
                let hasCache = await HistoryCache.has(cacheKey);
                if (isCancel) {

                    task = undefined;
                    return reject(new Error(isCancel));
                }
                if (hasCache) {

                    // lấy cache lên
                    let cacheHistory = await HistoryCache.get(cacheKey);
                    if (isCancel) {

                        task = undefined;
                        return reject(new Error(isCancel));
                    }

                    if (typeof cacheHistory === "string") {

                        try {
                            cacheHistory = JSON.parse(cacheHistory);
                            cacheHistory = cacheHistory || [];
                        } catch (e) { }
                    }

                    task = undefined;
                    return resolve(cacheHistory);
                }
            } catch (e) { }

            task = this.googleMapsClient.place({
                placeid,
                language: I18n.locale
            }, async (e, res) => {

                task = undefined;
                if (isCancel) {

                    return reject(new Error(isCancel));
                }

                // nếu lấy dữ liệu thành công
                if (!e && res.json) {

                    if (res.json.status === "OK" && res.json.result) {

                        const {
                            address_components,
                            formatted_address,
                            name,
                            place_id,
                            types,
                            url,
                            geometry,
                            vicinity
                        } = res.json.result;

                        const placeDetail = {
                            address_components,
                            formatted_address,
                            name,
                            place_id,
                            types,
                            url,
                            geometry,
                            vicinity
                        };

                        resolve(placeDetail);
                        try {

                            // cache adapter
                            var HistoryCache = CacheManager.resolve('location-history');

                            // lưu cache
                            await HistoryCache.put(cacheKey, placeDetail);
                        } catch (e) { }

                        return;
                    }
                    return reject(new Error(res.json.error_message || res.json.message || res.json.status));
                }

                reject(e || new Error("unknown error"));
                // e && e.message && toast(e.message);
            });
        } );

        _result.cancel = (message) => {

            isCancel = message || "canceled";
            task && task.cancel && task.cancel(message);
            task = undefined;
        };

        return _result;
    };

    // hàm tạo request google api
    /*
        geometry,
        name,
        place_id,
        types,
        vicinity
    */
    _createRequestPlacesNearby = async (location) => {

        const cacheKey = `place-nearby-${location.latitude}-${location.longitude}`;
        var isCancel = false;
        var task;

        const _result = new Promise(async (resolve, reject) => {

            if (isCancel) {

                task = undefined;
                return reject(new Error(isCancel));
            }

            try {

                // cache adapter
                var HistoryCache = CacheManager.resolve('location-history');

                // nếu có cache
                let hasCache = await HistoryCache.has(cacheKey);
                if (isCancel) {

                    task = undefined;
                    return reject(new Error(isCancel));
                }
                if (hasCache) {

                    // lấy cache lên
                    let cacheHistory = await HistoryCache.get(cacheKey);
                    if (isCancel) {

                        task = undefined;
                        return reject(new Error(isCancel));
                    }

                    if (typeof cacheHistory === "string") {

                        try {
                            cacheHistory = JSON.parse(cacheHistory);
                            cacheHistory = cacheHistory || [];
                        } catch (e) { }
                    }

                    task = undefined;
                    return resolve(cacheHistory);
                }
            } catch (e) { }

            task = this.googleMapsClient.placesNearby({
                location,
                rankby: 'distance',
                language: I18n.locale
            }, async (e, res) => {

                task = undefined;
                if (isCancel) {

                    return reject(new Error(isCancel));
                }

                // nếu lấy dữ liệu thành công
                if (!e && res.json) {

                    if (res.json.status === "OK" || res.json.status === "ZERO_RESULTS") {

                        var result = res.json.results && res.json.results || [];
                        result = result[0];

                        if( !result ) {

                            return resolve(null);
                        }

                        const {
                            geometry,
                            name,
                            place_id,
                            types,
                            vicinity
                        } = result;

                        const place = {
                            geometry,
                            name,
                            place_id,
                            types,
                            vicinity
                        };

                        resolve(place);
                        try {

                            // cache adapter
                            var HistoryCache = CacheManager.resolve('location-history');

                            // lưu cache
                            await HistoryCache.put(cacheKey, place);
                        } catch (e) { }

                        return;
                    }
                    return reject(new Error(res.json.error_message || res.json.message || res.json.status));
                }

                reject(e || new Error("unknown error"));
                // e && e.message && toast(e.message);
            });
        });

        _result.cancel = (message) => {

            isCancel = message || "canceled";
            task && task.cancel && task.cancel(message);
            task = undefined;
        };

        return _result;
    };

    // hàm tạo request google api
    /*
        geometry,
        name,
        place_id,
        types,
        vicinity
    */
    _createRequestDistance = async (start, end) => {

        const cacheKey = `place-distance-text-${ JSON.stringify(start) }-${ JSON.stringify(end) }`;
        var isCancel = false;
        var task;

        const _result = new Promise(async (resolve, reject) => {

            if (isCancel) {

                task = undefined;
                return reject(new Error(isCancel));
            }

            try {

                // cache adapter
                var HistoryCache = CacheManager.resolve('location-history');

                // nếu có cache
                let hasCache = await HistoryCache.has(cacheKey);
                if (isCancel) {

                    task = undefined;
                    return reject(new Error(isCancel));
                }
                if (hasCache) {

                    // lấy cache lên
                    let cacheHistory = await HistoryCache.get(cacheKey);
                    if (isCancel) {

                        task = undefined;
                        return reject(new Error(isCancel));
                    }

                    if (typeof cacheHistory === "string") {

                        try {
                            cacheHistory = JSON.parse(cacheHistory);
                            cacheHistory = cacheHistory || [];
                        } catch (e) { }
                    }

                    task = undefined;
                    return resolve(cacheHistory);
                }
            } catch (e) { }

            let startLat = (start.lat !== undefined && start.lat) || start.latitude;
            let startLng = (start.lng !== undefined && start.lng) || start.longitude;
            let endLat = (end.lat !== undefined && end.lat) || end.latitude;
            let endLng = (end.lng !== undefined && end.lng) || end.longitude;

            task = this.googleMapsClient.distanceMatrix({
                origins: [{
                    lat: startLat,
                    lng: startLng
                }],
                destinations: [{
                    lat: endLat,
                    lng: endLng
                }],
                mode: 'driving',
                avoid: [
                    'tolls',
                    'highways',
                    'ferries',
                    'indoor'
                ],
                departure_time: (new Date()).getTime(),
                traffic_model: "optimistic",
                transit_routing_preference: "less_walking",
                language: I18n.locale
            }, async (e, res) => {

                task = undefined;
                if (isCancel) {

                    return reject(new Error(isCancel));
                }

                // nếu lấy dữ liệu thành công
                if (!e && res.json) {

                    if (res.json.status === "OK" && res.json.rows ) {

                        const element = res.json.rows[0];
                        if (element && element.elements && element.elements[0]) {

                            if (element.elements[0].distance) {

                                resolve(element.elements[0].distance);
                                try {

                                    // cache adapter
                                    var HistoryCache = CacheManager.resolve('location-history');

                                    // lưu cache
                                    await HistoryCache.put(cacheKey, element.elements[0].distance);
                                } catch (e) { }

                                return;
                            }
                        }
                        
                        return reject(new Error("no result"));
                    }
                    return reject(new Error(res.json.error_message || res.json.message || res.json.status));
                }

                reject(e || new Error("unknown error"));
                // e && e.message && toast(e.message);
            });
        });

        _result.cancel = (message) => {

            isCancel = message || "canceled";
            task && task.cancel && task.cancel(message);
            task = undefined;
        };

        return _result;
    };
}

const _style = {
    flexDirection: "row",
    width: "100%",
    marginVertical: sizes.spacing
};

export default LocationItem;