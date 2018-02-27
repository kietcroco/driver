import uncheckAll from './uncheckAll';

/**
 * @todo: Hàm uncheck tất cả
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: nguồn, levels: cấp phần tử, filter: không đổi vùng nhớ những item trong mảng này
 * @return: data: Array
*/
const uncheckAllByLevels = (data: Array = [], levels: Array = [], filter: Array = []) => {

	if( !data.length ) return data;
	
	// tìm theo levels
	if( levels.length ) {

		// lấy cấp hiện tại
		let keyword = levels.shift();

		// tìm phần tử trùng khớp
		let i = data.findIndex( rowData => rowData.value == keyword );

		// nếu không tìm thấy tìm tiếp phần tử other
		if( i === -1 ) {
			i = data.findIndex( rowData => (rowData.isOther && rowData.otherValue == keyword) );
		}

		// nếu tìm thấy tiếp tục tìm vào cấp trong
		if( data[i] ){

			data[i].children = uncheckAllByLevels( data[i].children, levels, filter );
		}

	} else { // nếu đã duyệt hết cấp

		data = uncheckAll( data, filter );
	}

	return data;
};

export default uncheckAllByLevels;