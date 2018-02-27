/**
 * @todo: Hàm collapsed tất cả
 * @author: Croco
 * @since: 8-3-2017
 * @param: data: nguồn, filter: mảng item không thay đổi vùng nhớ
 * @return: data: Array
*/
const unSearch = (data: Array = [], filter: Array = []) => {

	if( !data.length ) return data;

	// cờ kiểm tra item có thay đổi hay không
	let hasChange = false;

	for ( let i = data.length - 1; i >= 0; i-- ) {

		if( data[i] ) {

			data[i].isHidden = false;
			hasChange = true;

			if( data[i] && data[i].children && Array.isArray( data[i].children ) ){

				data[i].collapsed = true;
					
				// duyệt tiếp cấp con
				data[i].children = unSearch( data[i].children, filter );

			}
			
			// nếu rowData có thay đổi thì đổi vùng nhớ
			if( (!filter.length || filter.indexOf( data[i] ) === -1) ) {
				
				data[i] = { ...data[i] };
			}
		}
	}

	// nếu có thay đổi thì đổi vùng nhớ data
	if( hasChange ) {

		data = data.slice();
	}

	return data;
};

export default unSearch;