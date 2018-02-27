import fillData from './fillData';
import uncheckAll from './uncheckAll';

/**
 * @todo: Hàm tạo data từ value
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: mảng cần khởi tạo, values: mảng object value, options: cấu hình ký tự cắt chuỗi, levels: cấp cần thêm
 * @return: data: Array
*/
export default ( data: Array = [], values: Array = [], options: Object = {}, levels: Array = [] ) => {

	// nếu có data bỏ check tất cả
	if( data.length ) {

		data = uncheckAll( data );
	}

	if( values.length ) {
		
		// duyệt value
		values.forEach( value => {

			if( value ) {
				
				// check data
				data = fillData( value, data, levels, options );
			}
		} );
	}

	return data;
};