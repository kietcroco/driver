import placeToAddress from '../utils/placeToAddress';
import checkItem from '../utils/checkItem';
import formatGeoCode from '../utils/formatGeoCode';

export default function( rowData, sectionID, rowID, levels, data ) {

	// clone data source
	let dataSource = this._dataSource.slice();

	// nếu co geolocation
	if( data.geoCode ) {

		data.geoCode = formatGeoCode( data.geoCode );

		// format địa chỉ từ json
		let address = placeToAddress( data.geoCode );

		// lấy địa danh | thành phố | tỉnh thành | quốc gia
		let _label = this.props.formatLabel( address );

		let _value = _label;

		data.label = _label;
		data.value = _value;
	}

	rowData.otherValue = data.value;
	rowData.otherLabel = data.label || data.value;
	rowData.geoCode = data.geoCode;
	rowData.isInput = data.isInput;

	if( rowData.otherValue ) {

		dataSource = checkItem( rowData, dataSource, levels );
		if( !rowData.multiple ) {

			this._applyHandle();
		}
	} else {

		rowData.checked = false;
	}

	dataSource[ rowID ] = { ...dataSource[ rowID ] };

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows( dataSource )
	});

	this._dataSource = dataSource;
};