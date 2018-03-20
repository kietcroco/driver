"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import SectionBox from '../SectionBox';
import { sizes, fontSizes, colors } from '~/configs/styles';
import LocationItem from './LocationItem';
import { history_search_limit } from '~/configs/map';

class SearchHistory extends React.Component {

    static displayName = "@SearchHistory";

    static propTypes = {
        onSelect: PropTypes.func,
        visible: PropTypes.bool,
        googleMapsClient: PropTypes.object,
        currentPosition: PropTypes.object
    };

    static defaultProps = {
        visible: true
    };

    constructor( props ) {
        super(props);

        this.state = {
            searchHistory: []
        };

        this._task = null;
        this.googleMapsClient = props.googleMapsClient || require("../../utils/createGoogleMapsClient").default();
    }

    shouldComponentUpdate( nextProps, nextState ) {

        return (
            this.props.visible !== nextProps.visible
            || this.props.currentPosition !== nextProps.currentPosition
            || this.state.searchHistory !== nextState.searchHistory
        );
    }

    render() {

        if( !this.state.searchHistory.length || !this.props.visible ) {

            return null;
        }

        return (
            <SectionBox style={_styles.container}>
                <View style={_styles.header}>
                    <Text style={_styles.title}>{`${translate("maps.search_history")}`.toUpperCase()}</Text>
                    {
                        !!this.state.searchHistory.length && 
                            <TouchableOpacity activeOpacity={colors.activeOpacity} onPress={this.clearCache}>
                                <Text style={_styles.clear}>{translate("maps.clear_search_history")}</Text>
                            </TouchableOpacity>
                    }
                </View>
                {
                    this.state.searchHistory.map( (geo, i) => {

                        return (
                            <LocationItem 
                                icon            = "history"
                                key             = {`location-history-${i}`} 
                                source          = {geo}
                                onSelect        = {this.props.onSelect}
                                googleMapsClient = {this.googleMapsClient}
                                currentPosition = {this.props.currentPosition}
                                isTyping        = {false}
                            />
                        );
                    } )
                }
            </SectionBox>
        );
    }

    componentDidMount() {

        this.syncHistoryCache();
    }

    componentWillUnmount() {

        if( this._task ) {

            this._task.cancel && this._task.cancel();
            this._task = undefined;
        }
    }

    /*
        //searched_time
        place_id,
        description,
        structured_formatting: {
            main_text,
            secondary_text
        },
        types
    */
    getSource = (place_id) => {

        if( place_id ) {

            return this.state.searchHistory.find( (geo) => {

                return geo.place_id === place_id;
            } );
        }

        return this.state.searchHistory;
    };

    // hàm xóa cache
    clearCache = async () => {

        try {

            const HistoryCache = CacheManager.resolve('location-history');
            await HistoryCache.clear();
            if (this._task) {

                this._task.cancel && this._task.cancel();
                this._task = undefined;
            }
            this.setState({
                searchHistory: []
            });
        } catch(e) {
            toast(translate("maps.clear_search_history_failed"));
        }
        
    };

    // hàm đồng bộ lịch sử tìm kiếm với cache
    /*
        //searched_time
        place_id,
        description,
        structured_formatting: {
            main_text,
            secondary_text
        },
        types
    */
    syncHistoryCache = async ( geoResult ) => {

        if (this._task) {

            this._task.cancel && this._task.cancel();
            this._task = undefined;
        }
        try {
            
            this._task = this._createRequestTask(geoResult);
            await this._task;
            this._task = undefined;
        } catch (e) {}
    };

    // hàm tạo task request google place api
    _createRequestTask = (geoResult) => {

        const cacheKey = "search-history";
        var isCancel = false;

        const result = new Promise( async (resolve, reject) => {

            if (isCancel) {

                return reject(new Error(isCancel));
            }

            var searchHistory = [];

            // nếu không có truyền geo mới thì lấy từ cache lên
            if (!geoResult) {

                try {
                    // cache adapter
                    let HistoryCache = CacheManager.resolve('location-history');

                    // nếu có cache
                    let hasCache = await HistoryCache.has(cacheKey);
                    if (isCancel) {

                        return reject(new Error(isCancel));
                    }

                    if (hasCache) {

                        // lấy cache lên
                        let cacheHistory = await HistoryCache.get(cacheKey);
                        if (isCancel) {

                            return reject(new Error(isCancel));
                        }

                        if (typeof cacheHistory === "string") {

                            try {
                                cacheHistory = JSON.parse(cacheHistory);
                                cacheHistory = cacheHistory || [];
                            } catch (e) { }
                        }
                        // lịch sử search
                        searchHistory = this.state.searchHistory && this.state.searchHistory.slice() || [];

                        searchHistory = cacheHistory || searchHistory;

                        // sắp xếp lại lịch sử theo thời gian gần nhất
                        searchHistory.sort((prev, next) => {

                            return next.searched_time - prev.searched_time;
                        });
                    }
                } catch (e) {
                    // e && e.message && toast(e.message);
                }
            }

            // nếu có geo mới thì lưu cache lại
            else if (typeof geoResult === "object" && geoResult.place_id) {

                // format lại geo Result (loại bỏ các prop không cần thiết)
                geoResult = {
                    searched_time: (new Date).getTime(), // thời gian tìm kiếm
                    place_id: geoResult.place_id, // place id
                    description: geoResult.description, // địa chỉ
                    structured_formatting: {
                        main_text: geoResult.structured_formatting && geoResult.structured_formatting.main_text,
                        secondary_text: geoResult.structured_formatting && geoResult.structured_formatting.secondary_text
                    },
                    types: geoResult.types
                };

                // lịch sử search
                searchHistory = this.state.searchHistory && this.state.searchHistory.slice() || [];

                // loại bỏ place id trùng
                searchHistory = searchHistory.filter(geo => (geo.place_id !== geoResult.place_id));

                // thêm vào đầu mảng lịch sử
                searchHistory.unshift(geoResult);

                // giới hạn 20 tin
                searchHistory = searchHistory.slice(0, history_search_limit);

                try {
                    // cache adapter
                    let HistoryCache = CacheManager.resolve('location-history');

                    await HistoryCache.put(cacheKey, searchHistory);
                } catch (e) {
                    // e && e.message && toast(e.message);
                }

            }

            if (isCancel) {

                return reject(new Error(isCancel));
            }

            if (!this.state.searchHistory || this.state.searchHistory.length !== searchHistory.length || geoResult) {

                this.setState({
                    searchHistory
                });
            }

            resolve(searchHistory);
        } );

        result.cancel = (message) => {

            isCancel = message || "canceled";
        };

        return result;
    };
}

const _styles = {
    container: {
        marginHorizontal: sizes.margin
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        color: colors.textItalicColor,
        fontSize: fontSizes.large,
        marginLeft: sizes.margin,
        marginVertical: sizes.margin
    },
    clear: {
        color: colors.textItalicColor,
        fontSize: fontSizes.large,
        marginRight: sizes.margin,
        marginVertical: sizes.margin
    }
};

export default SearchHistory;