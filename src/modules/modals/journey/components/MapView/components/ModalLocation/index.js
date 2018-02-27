"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Modal } from 'react-native';
import SearchBar from '../SearchBar';
import { scale, colors, fontSizes, hitSlop, shadow, sizes } from '~/configs/styles';
import SectionBox from '~/components/SectionBox';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import LocationItem from './LocationItem';
import GooglePlaceService from '~/library/GooglePlaceService';
import SearchHistory from './SearchHistory';
import { history_search_limit } from '~/configs/map';
import { createClient } from '~/library/googlemaps';

const Geo = new GooglePlaceService({
    key: "AIzaSyC-i8cGSfbOy_Y0B9VB9_UwXRkOjABQP9I"
});
const a = createClient({
    key: "AIzaSyC-i8cGSfbOy_Y0B9VB9_UwXRkOjABQP9I"
});
var b = a.placesAutoComplete({
    input: "Hồ chí minh"
}, (...c) => console.log(c));
console.log(b)
class ModalLocation extends React.Component {

    static displayName = "@ModalLocation";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            searchHistory: []
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        return (
            <Modal
                visible={true}
                onRequestClose={() => { }}
                transparent={false}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: colors.mapModalBackgroundColor,
                }}>
                    <SearchBar
                        ref={ref => (this.searchBar = ref)}
                        editable={true}
                        directionButton={false}
                        backButton={true}
                        onChangeText={searchText => {
                            this.setState({
                                searchText
                            });
                        }}
                        clearOnPress={() => {
                            this.setState({
                                searchText: ""
                            });
                        }}
                        backOnPress={() => {

                        }}
                    >
                        {this.state.searchText}
                    </SearchBar>
                    <SearchHistory />
                </View>
            </Modal>
        );
    }

    componentDidMount() {

        this._syncHistoryCache();
        Geo.getSuggestions("107 bến vân đồn").then( v => {
            console.log('getSuggestions',v);
            this._syncHistoryCache(v[0]);
        } ).catch(e => console.log(e));


        var googleMapsClient = createClient({
            key: "AIzaSyC-i8cGSfbOy_Y0B9VB9_UwXRkOjABQP9I"
        });

        googleMapsClient.geocode({
            address: '1600 Amphitheatre Parkway, Mountain View, CA'
        }, function (err, response) {
            if (!err) {
                console.log(response.json.results);
            }
        });
    }

    // hàm đồng bộ lịch sử tìm kiếm với cache
    _syncHistoryCache = async ( geoResult ) => {

        // cache adapter
        const HistoryCache = CacheManager.resolve('location-history');
        try {

            // lịch sử search
            var searchHistory = this.state.searchHistory && this.state.searchHistory.slice() || [];
            let cacheKey = "search-history";

            // nếu không có truyền geo mới thì lấy từ cache lên
            if (!geoResult) {

                // nếu có cache
                let hasCache = await HistoryCache.has(cacheKey);
                if (hasCache) {
                    
                    // lấy cache lên
                    let cacheHistory = await HistoryCache.get(cacheKey);
                    searchHistory = cacheHistory || searchHistory;
                    // sắp xếp lại lịch sử theo thời gian gần nhất
                    searchHistory.sort( (prev, next) => {

                        return next.searched_time - prev.searched_time;
                    } );
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
                    }
                };

                // loại bỏ place id trùng
                searchHistory = searchHistory.filter(geo => (geo.place_id !== geoResult.place_id) );

                // thêm vào đầu mảng lịch sử
                searchHistory.unshift(geoResult);

                // giới hạn 20 tin
                searchHistory = searchHistory.slice(0, history_search_limit);
                await HistoryCache.put(cacheKey, searchHistory);
            }

            if (!this.state.searchHistory || this.state.searchHistory.length !== searchHistory.length) {

                this.setState({
                    searchHistory
                });
            }
        } catch (e) {}
    };
}

const _styles = {
};

export default ModalLocation;