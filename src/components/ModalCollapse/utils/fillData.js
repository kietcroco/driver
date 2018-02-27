import checkItem from './checkItem';
import findEq from './findEq';
import arrKeyConfig from './arrKeyConfig';

/**
 * @todo: Hàm tìm và thêm value vào mảng nếu chưa có
 * @author: croco
 * @since: 22-3-2017
 * @param: data: mảng cần thêm, levels: mảng value theo cấp, props: các props của item
 * @return: data: Array
*/
const findAndInsert = ( data: Array = [], levels: Array = [], props: Object ) => {

	if( !levels.length ) return data;

	// giá trị ở cấp hiện tại
	let value = levels.shift();

	// vị trí item select all
	let selectAllIndex = -1;

	// vị trí item other
	let otherIndex = -1;

	// vị trí item tìm được
	let foundIndex = -1;

	// cờ kiểm tra dữ liệu bị thay đổi
	let hasChange = false;

	// duyệt data
	data.length && data.some( (rowData, i ) => {

		// nếu là item select all thì lưu lại vị trí
		if( selectAllIndex === -1 && rowData.isSelectAll ) {
			selectAllIndex = i;
		}

		// nếu là item other thì lưu lại vị trí
		if( otherIndex === -1 && rowData.isOther ) {

			otherIndex = i;
		}

		// nếu là item trùng khớp thì lưu lại vị trí
		if( foundIndex === -1 && rowData.value == value ) {

			foundIndex = i;
		}

		// nếu tìm được cả 3 item thì break
		return (selectAllIndex !== -1 && otherIndex !== -1 && foundIndex !== -1);
	} );

	// nếu không tìm thấy item
	if( foundIndex === -1 ) {

		// nếu không tìm thấy other
		if( otherIndex === -1 ) {

			// lấy vị trí của select all hoặc vị trí đầu tiên
			foundIndex = selectAllIndex !== -1 ? selectAllIndex + 1 : 0;

			// tạo item mới
			let rowData = {
				label: value,
				value: value,
				isInsert: true
			};

			// add item mới vào mảng
			data.splice( foundIndex, 0, rowData );

		}else { // nếu có item other

			// set lại vị trí là item other
			foundIndex = otherIndex;

			// set giá trị cho item other
			if( data[ foundIndex ] ) {

				data[ foundIndex ].otherValue = value;
				data[ foundIndex ].otherLabel = value;
				hasChange = true;
			}
		}
	}

	// nếu có item
	if( data[ foundIndex ] ) {

		// tiếp tục duyệt nếu còn cấp con
		if( levels.length ){

			// tạo group
			data[ foundIndex ].children = findAndInsert( data[ foundIndex ].children, levels, props );
			hasChange = true;
		}else if( props ){

			// gán props
			data[ foundIndex ] = { ...data[ foundIndex ] };

			// extends props
			Object.keys( props ).forEach( key => {

				// nếu không nằm trong mảng cần bỏ qua
				if( arrKeyConfig.indexOf( key ) === -1 ) {

					data[ foundIndex ][ key ] = props[ key ];
				}
			} );

			hasChange = false;
		}

		// nếu có thay đổi dữ liệu thì thay đổi vùng nhớ
		if( hasChange ) {

			data[ foundIndex ] = { ...data[ foundIndex ] };
		}
	}

	return data;
};

/**
 * @todo: Hàm tạo và check item vào dataSource
 * @author: Croco
 * @since: 22-3-2017
 * @param: props: value, dataSource: nguồn, levels: cấp cần thêm, options: cấu hình, data: data cấp hiện tại
 * @return: dataSource: Array
*/
export default ( props: Object = {}, dataSource: Array = [], levels: Array = [], options: Object = {}, data: Array) => {

	// lấy cấp phần tử của value cần thêm tính từ levels
	let _levels = (props.value || "").split( options.delimiter );

	// lấy data theo levels nếu không truyền
	data = data ? data : findEq( dataSource, levels.slice() );

	// nếu tìm thấy, thêm value vào
	data = data ? findAndInsert( data, _levels.slice(), props ) : undefined;

	// lấy value của item
	let keyword = _levels.pop();
	
	// tìm tiếp đến cấp value vừa tạo
	data = data ? findEq( data, _levels.slice() ) : undefined;

	if( data && data.length ) {

		// tìm item vừa tạo
		let item = data.find( rowData => ( rowData.value == keyword || (rowData.isOther && rowData.otherValue == keyword) ) );

		if( item ) {

			// check item
			dataSource = checkItem( item, dataSource, [...levels, ..._levels] );
		}
	}

	return dataSource;
};