import uncheckSelectAllByLevels from './uncheckSelectAllByLevels';
import uncheckAllByLevels from './uncheckAllByLevels';
import uncheckAll from './uncheckAll';

/**
 * @todo: Hàm check item
 * @author: Croco
 * @since: 8-3-2017
 * @param: item: item cần chọn, dataSource: nguồn, levels: cấp
 * @return: dataSource: Array
*/
export default ( item: Object, dataSource: Array = [], levels: Array = [], closeCollapse: Boolean = true ) => {

	// check rỗng
	if( !dataSource.length || !item ) return dataSource;

	if( !item.multiple ) {

		// bỏ check tất cả
		dataSource = uncheckAll( dataSource, [item], closeCollapse);
	} else {

		// uncheck các item select all cùng cấp
		dataSource = uncheckSelectAllByLevels( dataSource, levels.slice(), [item] );

		// nếu là item select all
		if( item.isSelectAll ) {

			// uncheck các item thường từ cấp hiện tại về sau
			dataSource = uncheckAllByLevels( dataSource, levels.slice(), [item] );
		}
	}
	
	item.checked = true;

	return dataSource;
};