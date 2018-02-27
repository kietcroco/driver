/**
 * @todo: Hàm bỏ check item select all theo levels
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: nguồn, levels: mảng cấp bậc, filter: những phần tử không thay đổi vùng nhớ
 * @return: data: Array
*/
const uncheckSelectAllByLevels = ( data: Array = [], levels: Array = [], filter: Array = [] ) => {

	if( !data.length ) return data;

	let hasChange = false;

	// tìm item select all trong cấp hiện tại
	let index = data.findIndex( rowData => rowData.isSelectAll );

	// nếu tìm thấy và trạng thái được checked hoặc đang nhập other
	if( 
		data[index] && 
		(
			data[index].checked /*|| 
			( data[index].isOther && data[index].otherValue && data[index].isInput ) */
		) 
	) {

		data[index].checked = false;
		data[index].isInput = false;

		// thay đổi vùng nhới nếu không có trong mảng loại trừ
		if( !filter.length || filter.indexOf( data[index] ) === -1 ) {

			data[index] = { ...data[index] };
			hasChange = true;
		}
	}

	// nếu còn cấp trong tiếp tục duyệt
	if( levels.length ) {

		// lấy value cấp hiện tại
		let keyword = levels.shift();

		// tìm cấp tiếp theo
		index = data.findIndex( rowData => (rowData.value == keyword) );

		// nếu không tìm thấy thì tìm phần tử other
		if( index === -1 ) {

			index = data.findIndex( rowData => (rowData.isOther && rowData.otherValue == keyword) );
		}

		// tiếp tục tìm trong cấp con
		if( data[index] ) {

			data[index].children = uncheckSelectAllByLevels( data[index].children, levels, filter );
		}
	}

	// thay đổi vùng nhớ nếu change
	if( hasChange ) {

		data = data.slice();
	}

	return data;
};

export default uncheckSelectAllByLevels;