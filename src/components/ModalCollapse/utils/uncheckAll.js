/**
 * @todo: Hàm uncheck tất cả
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: nguồn, filter: mảng item không thay đổi vùng nhớ
 * @return: data: Array
*/
const uncheckAll = (data: Array = [], filter: Array = [], closeCollapse: Boolean = true) => {

	if( !data.length ) return data;

	// cờ kiểm tra item có thay đổi hay không
	let hasChange = false;

	for ( let i = data.length - 1; i >= 0; i-- ) {
		
		if( data[i] ){

			let isChange = false;

			// bỏ checked
			if( data[i].checked ) {

				data[i].checked = false;
				isChange = true;
			}

			// bỏ hiển thị input nếu là item other
			if( data[i].isOther && data[i].isInput ){

				data[i].isInput = false;
				isChange = true;
			}

			// nếu là group
			if( data[i].children && Array.isArray( data[i].children ) ) {

				// đóng collapse
				if( closeCollapse ) {
					
					data[i].collapsed = true;
					isChange = true;
				}

				// duyệt tiếp cấp con
				data[i].children = uncheckAll( data[i].children, filter, closeCollapse );
			}

			// nếu rowData có thay đổi thì đổi vùng nhớ
			if( isChange && (!filter.length || filter.indexOf( data[i] ) === -1) ) {
				
				data[i] = { ...data[i] };
				hasChange = true;
			}
		}
	}

	// nếu có thay đổi thì đổi vùng nhớ data
	if( hasChange ) {

		data = data.slice();
	}

	return data;
};

export default uncheckAll;