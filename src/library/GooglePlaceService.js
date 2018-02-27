// import Qs from 'qs';
import I18n from '~/library/i18n/I18n';
import deepExtend from '~/library/deepExtend';
import axios from 'axios';
import MemoryCache from '~/library/Cache/Adapter/Memory';

const DEFAULT_CONFIGS = {
    // key: "AIzaSyCpp9bGeX4-0WhZnbz4DuicdzY9ZAT-7Lo",
    query: {
        types: ['geocode', 'establishment']
    },
    nearbyPlacesAPI: "GooglePlacesSearch",
    GoogleReverseGeocodingQuery: { // https://developers.google.com/maps/documentation/geocoding/intro

    },
    GooglePlacesSearchQuery: { // https://developers.google.com/places/web-service/search
        rankby: 'distance',
        types: 'food'
    },
    filterReverseGeocodingByTypes: [
        'locality', 
        'administrative_area_level_3'
    ]
};

class GooglePlaceService {

    constructor(configs = {}) {

        this.configs = deepExtend({ ...DEFAULT_CONFIGS }, configs );

        this.task = undefined;
        this.cache = new MemoryCache(`place-auto-complete-${(new Date).getTime()}`);
    }

    clearCache = () => {

        this.cache.clear();
    };

    abort = () => {

        if (this.task && this.task.abort ) {

            this.task.abort();
            this.task = undefined;
        }
    };

    // lấy thông tin chi tiết của place_id
    fetchDetail = async (place_id = "", options = {}) => {

        this.abort();
        const url = 'https://maps.googleapis.com/maps/api/place/details/json';
        const params = {
            place_id,
            key: this.configs.query.key || this.configs.key,
            language: I18n.locale,
            ...options
        };

        const cacheKey = JSON.stringify(params);

        try {
            let hasCache = await this.cache.has(cacheKey);
            if (hasCache) {

                let result = await this.cache.get(cacheKey);
                return Promise.resolve(result);
            }
        } catch (e) {}

        // cancel request token
        const source = axios.CancelToken.source();

        const deferred = axios({
            url,
            method: "get",
            cancelToken: source.token,
            // headers: {},
            params
        });

        deferred.abort = (message: String) => source.cancel(message);

        deferred.isCancel = thrown => axios.isCancel(thrown);

        this.task = deferred;

        return new Promise((resolve, reject) => {

            deferred.then(response => {

                if (response.status >= 200 && response.status < 300) {

                    // success
                    if (response.data.status === "OK" || response.data.status === "ZERO_RESULTS") {

                        this.cache.put(cacheKey, response.data.result);
                        return resolve(response.data.result);
                    }
                    return reject(new Error(response.data.error_message || response.data.status));
                }
                reject(new Error(response.status));
            });
            deferred.catch(e => reject(e));
        });
    };

    // hàm lấy gợi ý
    getSuggestions = async (input = "", options = {}) => {

        this.abort();
        const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        const params = {
            ...this.configs.query,
            input,
            key: this.configs.query.key || this.configs.key,
            language: I18n.locale,
            ...options
        };

        const cacheKey = JSON.stringify(params);

        try {
            let hasCache = await this.cache.has(cacheKey);
            if (hasCache) {

                let result = await this.cache.get(cacheKey);
                return Promise.resolve(result);
            }
        } catch (e) {}

        // cancel request token
        const source = axios.CancelToken.source();

        const deferred = axios({
            url,
            method: "get",
            cancelToken: source.token,
            // headers: {},
            params
        });

        deferred.abort = (message: String) => source.cancel(message);

        deferred.isCancel = thrown => axios.isCancel(thrown);

        this.task = deferred;

        return new Promise((resolve, reject) => {

            deferred.then( response => {

                if (response.status >= 200 && response.status < 300) {

                    // success
                    if (response.data.status === "OK" || response.data.status === "ZERO_RESULTS") {

                        this.cache.put(cacheKey, response.data.results);
                        return resolve(response.data.predictions);
                    }
                    return reject(new Error(response.data.error_message || response.data.status));
                }
                reject(new Error(response.status));
            } );
            deferred.catch(e => reject(e));
        });
    };
    
    getNearby = async (coords = {}, options = {}) => {

        this.abort();
        
        let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        const {
            latitude,
            longitude
        } = coords;

        const {
            nearbyPlacesAPI = this.configs.nearbyPlacesAPI
        } = options;
        
        let params = {
            ...this.configs.GooglePlacesSearchQuery,
            location: `${latitude},${longitude}`,
            key: this.configs.GooglePlacesSearchQuery.key || this.configs.query.key || this.configs.key,
            language: I18n.locale,
            ...options
        };

        if (nearbyPlacesAPI === "GoogleReverseGeocoding") {

            url = "https://maps.googleapis.com/maps/api/geocode/json";
            params = {
                ...this.configs.GoogleReverseGeocodingQuery,
                latlng: `${latitude},${longitude}`,
                key: this.configs.GoogleReverseGeocodingQuery.key || this.configs.query.key || this.configs.key,
                language: I18n.locale,
                ...options
            };
        }

        const cacheKey = JSON.stringify(params);

        try {
            let hasCache = await this.cache.has(cacheKey);
            if (hasCache) {

                let result = await this.cache.get(cacheKey);
                return Promise.resolve(result);
            }
        } catch (e) {}

        // cancel request token
        const source = axios.CancelToken.source();

        const deferred = axios({
            url,
            method: "get",
            cancelToken: source.token,
            // headers: {},
            params
        });

        deferred.abort = (message: String) => source.cancel(message);

        deferred.isCancel = thrown => axios.isCancel(thrown);

        this.task = deferred;

        return new Promise((resolve, reject) => {

            deferred.then(response => {

                if (response.status >= 200 && response.status < 300) {

                    // success
                    if (response.data.status === "OK" || response.data.status === "ZERO_RESULTS") {

                        this.cache.put(cacheKey, response.data.results);
                        return resolve(response.data.results);
                    }
                    return reject(new Error(response.data.error_message || response.data.status));
                }
                reject(new Error(response.status));
            });
            deferred.catch(e => reject(e));
        });
    };
}

export default GooglePlaceService;