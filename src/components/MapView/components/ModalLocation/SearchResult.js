"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import SectionBox from '../SectionBox';
import { sizes } from '~/configs/styles';
import LocationItem from './LocationItem';
// import shallowEqual from 'fbjs/lib/shallowEqual';
import I18n from '~/library/i18n/I18n';

class SearchResult extends React.Component {

    static displayName = "@SearchResult";

    static propTypes = {
        input: PropTypes.string,
        hasHistory: PropTypes.func.isRequired,
        onSelect: PropTypes.func,
        visible: PropTypes.bool,
        googleMapsClient: PropTypes.object,
        currentPosition: PropTypes.object
    };

    static defaultProps = {
        visible: true,
        hasHistory: () => false
    };

    constructor( props ) {
        super( props );

        this.state = {
            source: [],
            isTyping: false
        };

        this._task = null;
        this.googleMapsClient = props.googleMapsClient || require("../../utils/createGoogleMapsClient").default();

        this._typingID = undefined;
    }

    componentWillReceiveProps(nextProps) {

        if( this.props.input !== nextProps.input ) {

            if( nextProps.input ) {

                this.requestSuggestion(nextProps.input);
                if( this._typingID ) {

                    clearTimeout( this._typingID );
                    this._typingID = undefined;
                }
                this.setState({
                    isTyping: true
                }, () => {

                    this._typingID = setTimeout( () => {

                        if (this._typingID) {

                            clearTimeout(this._typingID);
                            this._typingID = undefined;
                        }
                        this.setState({
                            isTyping: false
                        });
                    }, 250 );
                });
            } else {

                this.stopRequestSuggestion();
                this.setState({
                    source: [],
                    isTyping: false
                });
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.source !== nextState.source
            || this.state.isTyping !== nextState.isTyping
            || this.props.visible !== nextProps.visible
            || this.props.currentPosition !== nextProps.currentPosition
            // || !shallowEqual(this.props, nextProps)
        );
    }

    render() {

        if( !this.state.source.length || !this.props.visible ) {

            return null;
        }

        return (
            <SectionBox style={_styles.container}>
                {
                    this.state.source.map( (geo, i) => {

                        return (
                            <LocationItem 
                                key              = {`location-result-${i}`} 
                                source           = {geo}
                                onSelect         = {this.props.onSelect}
                                googleMapsClient = {this.googleMapsClient}
                                currentPosition  = {this.props.currentPosition}
                                isTyping         = { this.state.isTyping }
                            />
                        );
                    } )
                }
            </SectionBox>
        );
    }

    componentDidMount() {

        if( this.props.input ) {

            this.requestSuggestion( this.props.input );
        }
    }

    componentWillUnmount() {

        this.stopRequestSuggestion();

        this._typingID && clearTimeout(this._typingID);
    }

    // hàm tạo request
    /*
        [
            description,
            place_id,
            structured_formatting: {
                main_text,
                secondary_text
            },
            types,
            isHistory
        ]
    */
    requestSuggestion = async (searchText = "") => {

        this.stopRequestSuggestion();

        try {

            // set task
            this._task = this._createRequestTask(searchText);
            await this._task;
            this._task = undefined;
        } catch (error) { }
    };

    // hàm huỷ request
    stopRequestSuggestion = () => {

        try {

            if( this._task ) {

                this._task.cancel && this._task.cancel();
                this._task = undefined;
            }
        } catch(e){}
    };

    // hàm tạo task request google place api
    /*
        [
            description,
            place_id,
            structured_formatting: {
                main_text,
                secondary_text
            },
            types,
            isHistory
        ]
    */
    _createRequestTask = (searchText = "") => {

        const cacheKey = `geocomplete-${searchText}`;
        var isCancel = false;
        var task;

        const _result = new Promise( async (resolve, reject) => {

            if (!searchText && !isCancel) {

                this.setState({
                    source: []
                });
                return resolve([]);
            }
            
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

                    // repair lại geo check in history
                    cacheHistory = cacheHistory.map(geo => {

                        const {
                            description,
                            place_id,
                            structured_formatting: {
                                main_text,
                                secondary_text
                            } = {},
                            types
                        } = geo;

                        return {
                            description,
                            place_id,
                            structured_formatting: {
                                main_text,
                                secondary_text
                            },
                            types,
                            isHistory: this.props.hasHistory(place_id)
                        };
                    });

                    task = undefined;
                    resolve(cacheHistory);
                    return this.setState({
                        source: cacheHistory
                    });
                }

            } catch (e) { }

            task = this.googleMapsClient.placesAutoComplete({
                input: searchText,
                language: I18n.locale
            }, async (e, res) => {

                task = undefined;

                if (isCancel) {

                    return reject(new Error(isCancel));
                }

                // nếu lấy dữ liệu thành công
                if (!e && res.json ) {

                    if (res.json.status === "OK" || res.json.status === "ZERO_RESULTS") {

                        // repair geo chỉ lấy những props cần thiết
                        const result = res.json.predictions.map(geo => {

                            const {
                                description,
                                place_id,
                                structured_formatting: {
                                    main_text,
                                    secondary_text
                                } = {},
                                types
                            } = geo;

                            return {
                                description,
                                place_id,
                                structured_formatting: {
                                    main_text,
                                    secondary_text
                                },
                                types,
                                isHistory: this.props.hasHistory(place_id)
                            };
                        });

                        this.setState({
                            source: result
                        });

                        if (result.length) {

                            try {

                                // cache adapter
                                var HistoryCache = CacheManager.resolve('location-history');

                                // lưu cache
                                await HistoryCache.put(cacheKey, result);
                            } catch (e) { }
                        }

                        resolve(result);
                        return;
                    }

                    this.setState({
                        source: []
                    });

                    return reject(new Error(res.json.error_message || res.json.message || res.json.status));
                }
                
                this.setState({
                    source: []
                });

                reject(e || new Error("unknown error"));
                e && e.message && toast(e.message);
            });

        } );

        _result.cancel = (message) => {

            isCancel = message || "canceled";
            task && task.cancel && task.cancel(message);
            task = undefined;
        };
  
        return _result;
    };
}

const _styles = {
    container: {
        marginHorizontal: sizes.margin
    }
};

export default SearchResult;