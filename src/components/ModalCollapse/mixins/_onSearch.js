import placeToAddress from '../utils/placeToAddress';
import fillData from '../utils/fillData';
import formatGeoCode from '../utils/formatGeoCode';
import search from '../utils/search';
import unSearch from '../utils/unSearch';

export default function( value: String = "", geoCode: Object = null, keyword: String = "" ) {

	// clone data source
	let dataSource = this._dataSource.slice();

	if( this.props.searchToOther ) {

		// prop của item
		let data = {
			value,
			label: value,
			geoCode,
			keyword,
			isInsert: true,
			isSearch: true,
			multiple: this.props.multiple
		};

		// nếu co geolocation
		if( geoCode ) {

			geoCode = formatGeoCode( geoCode );

			// format địa chỉ từ json
			let address = placeToAddress( geoCode );

			// lấy địa danh | thành phố | tỉnh thành | quốc gia
			let _label = this.props.formatLabel( address );

			let _value = _label;

			if( address.Country.long_name !== _value ) {

				// value lấy quốc gia làm parent
				_value = (address.Country.long_name + this.props.delimiter + _value);
			}

			data.label = _label;
			data.value = _value;
		}

		// tạo item mới
		dataSource = fillData( data, dataSource, [], {
			separate: this.props.separate,
			delimiter: this.props.delimiter,
			labelDelimiter: this.props.labelDelimiter,
			showParent: this.props.showParent
		} );

		const callBack = this.props.multiple ? undefined : () => {

			this._applyHandle();
		};

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows( dataSource ),
			searchKeyword: "",
			searchValue: ""
		}, callBack);

	} else {

		if( !value || !value.length ) {

			dataSource = unSearch( dataSource );

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows( dataSource ),
				isSearching: false
			});
		} else {

			// tìm với text đã nhập
			search( dataSource, value );

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows( dataSource ),
				searchValue: value,
				isSearching: true
			});
		}
	}

	this._dataSource = dataSource;
};