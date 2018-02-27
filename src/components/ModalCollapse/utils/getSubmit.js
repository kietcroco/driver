import arrKeyConfig from './arrKeyConfig';

/**
 * @todo: Hàm lấy dữ liệu submit
 * @author: Croco
 * @since: 16-3-2017
 * @param: data: mảng data, options: cấu hình dấu phân cấp
 * @return: object { labels: [], values: [] }
*/
export default ( data: Array = [], options: Object = {} ) => {

	let result = {
		labels: [],
		values: []
	};

	if( !data.length ) return result;

	// hàm tìm value đã checked
	let _getSubmit = ( rowData: Object, label: Array = [], value: Array = [] ) => {

		if( !rowData ) return;

		// nếu là group
		if( rowData.children && Array.isArray( rowData.children ) ) {

			// cờ cho phép hiển thị label của parent
			let showParent = rowData.hasOwnProperty('showParent') ? rowData.showParent : options.showParent;

			// nếu là tin khác và có value
			if( rowData.isOther && rowData.otherValue ) {

				// thêm value là other
				value.push( rowData.otherValue );
				showParent && label.push( rowData.otherLabel );
			} else {

				// thêm value
				value.push( rowData.value );
				showParent && label.push( rowData.label );
			}

			// đệ quy
			rowData.children.length && rowData.children.forEach( rD => {

				// clone label, value
				let _label = label.slice();
				let _value = value.slice();

				// nếu label ẩn
				if( rD.hideLabel ) {

					// lấy label của parent
					_label.push( rowData.label );
				}

				// đệ quy
				_getSubmit( rD, _label, _value );
			} );
		} else { // nếu là item

			// nếu là checked hoặc other và có nhập dữ liệu
			if(rowData.checked /*|| ( rowData.isOther && rowData.otherValue && rowData.isInput )*/ ) {

				// nếu là other
				if( rowData.isOther && rowData.otherValue ) {

					// thêm value là other
					value.push( rowData.otherValue );
					!rowData.hideLabel && label.push( rowData.otherLabel );
				} else {

					// thêm value
					value.push( rowData.value );
					!rowData.hideLabel && label.push( rowData.label );
				}

				// push vào multi value
				if( label.length && value.length ) {

					// thêm label vào submit
					result.labels.push( label.join( options.labelDelimiter ) );

					// extends props
					Object.keys( rowData ).forEach( key => {

						// nếu không nằm trong mảng cần bỏ qua
						if( key !== "multiple" && key !== "translate" && arrKeyConfig.indexOf( key ) === -1 ) {

							value[ key ] = rowData[ key ];
						}
					} );

					// thêm value vào submit
					result.values.push( {
						value: value.join( options.delimiter )
					} );
				}

			}
		}
	};

	data.forEach( rowData => {
		
		// gán dữ liệu vào result
		_getSubmit( rowData );
	});

	return result;
};