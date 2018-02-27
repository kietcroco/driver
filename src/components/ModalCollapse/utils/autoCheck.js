import checkItem from './checkItem';
import findEq from './findEq';

/**
 * @todo: Hàm tự động check
 * @author: Croco
 * @since: 18-3-2017
 * @param: dataSource: nguồn, levels: cấp item, multiple, filter: mảng item không đổi vùng nhớ
 * @return: dataSource: Array
*/
export default (dataSource: Array = [], levels: Array = [], multiple: Boolean = true, filter: Array = []) => {

	if( !dataSource.length ) return dataSource;

	// nếu là single
	if( !multiple || multiple && !levels.length ) {

		// tìm phần tử checked
		let i = dataSource.findIndex( function findIndex( rowData ) {

			// nếu là checked hoặc other và đang nhập input
			if( 
				rowData.checked /*|| 
				( rowData.isOther && rowData.otherValue && rowData.isInput )*/
			 ) {

				return true;
			} else if( rowData.children && Array.isArray( rowData.children ) ) { // nếu là group

				return rowData.children.findIndex( findIndex ) !== -1; // tiếp tục tìm cấp con
			}

			return false;
		} );

		// nếu đã có item checked
		if( i !== -1 ) {

			return dataSource;
		}
	}

	// tìm đến cấp item
	let data = findEq( dataSource, levels.slice() );

	// nếu trong cùng cấp item có phần tử được checked
	if( !data || data.findIndex( 
		rowData => (
				rowData.checked /*|| 
				( rowData.isOther && rowData.otherValue && rowData.isInput )*/
			) 
		) !== -1 
	) {

		return dataSource;
	}

	if( data.length ) {

		// duyệt để tìm item autoCheck
		let i;
		for( i in data ){

			// nếu item là auto check và chưa được check
			if( data[i].autoCheck && !data[i].checked /*|| (data[i].isOther && data[i].otherValue && !data[i].isInput)*/ ) {

				// nếu là other mở input lên
				if( data[i].isOther ) {

					data[i].isInput = true;
				}

				// checked item
				dataSource = checkItem( data[i], dataSource, levels, false );

				// nếu không nằm trong mảng filter thì thay đổi vùng nhớ
				if( dataSource[ data[i].rowID ] !== undefined && (!filter.length || filter.indexOf(data[i]) === -1) ) {

					dataSource[ data[i].rowID ] = { ...dataSource[ data[i].rowID ] };
				}

				if( !multiple ) {
					break;
				}
			}
		}
	}

	return dataSource;
};