/**
 * @todo: Hàm remove item khi uncheck (item được insert vào sau, không nằm trong mảng cấu hình)
 * @author: Croco
 * @since: 23-3-2017
 * @param: item: phần tử uncheck, levels: cấp phần tử, dataSource: nguồn
 * @return: dataSource: Array
*/
export default ( item: Object, levels: Array = [], dataSource: Array = [] ) => {

	if( !item ) return dataSource;

	// hàm đệ quy tìm phần tử và xoá
	let _removeItem = ( data: Array, _levels: Array = [] ) => {

		if( !data || !data.length ) return;

		// index tìm được
		let i = -1;

		// nếu là cấp cha thì lấy từ levels, ngoài ra lấy từ item
		let keyword = _levels.length ? _levels.shift() : item.isOther && item.otherValue || item.value;

		// tìm phần tử
		i = data.findIndex( rowData => ( rowData.value == keyword ) );

		// nếu không tìm thấy tìm tiếp other
		if( i == -1 ) {

			i = data.findIndex( rowData => ( rowData.isOther && rowData.otherValue == keyword ) );
		}

		// nếu tìm thấy
		if( i !== -1 && data[i] ) {

			// nếu là group
			if( data[i].children && Array.isArray( data[i].children ) ) {

				// đệ quy tiếp
				data[i].children.length && _removeItem( data[i].children, _levels );

				// nếu là phần tử được insert và bị xoá hết thì xoá luôn phần tử này
				if( !data[i].children.length && data[i].isInsert ) {

					data.splice( i, 1 );
				}
			}else {

				// nếu là phần tử được insert thì xoá
				if( data[i].isInsert ) {

					data.splice( i, 1 );
				}
			}
		}
	};

	// tìm và xoá
	_removeItem( dataSource, levels.slice() );
	return dataSource;
};