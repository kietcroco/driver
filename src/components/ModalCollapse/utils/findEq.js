/**
 * @todo: Hàm tìm data theo level
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: Array, levels: Array = mảng cấp value
 * @return: data: Array | undefined
*/
const findEq = ( data: Array, levels: Array = [] ) => {

	if( !levels.length || levels.length && !data ) return data;

	// lấy value cấp hiện tại
	let keyword = levels.shift();

	// tìm trong cấp hiện tại theo value
	let found = data.find( rowData => (rowData.value == keyword) );

	// nếu không tìm thấy, tìm phần tử other
	if( !found ) {

		found = data.find( rowData => (rowData.isOther && rowData.otherValue == keyword) );
	}

	if( found ) {

		// tiếp tục tìm vào cấp trong
		data = levels.length ? findEq( found.children, levels ) : found.children;
	} else {
		
		data = undefined;
	}

	return data;
};

export default findEq;