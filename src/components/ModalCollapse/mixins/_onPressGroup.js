import findEq from '../utils/findEq';
import autoCheck from '../utils/autoCheck';

export default function( rowData, sectionID, rowID, levels ) {

	let dataSource = this._dataSource.slice();

	const changed = [];
	changed.push( rowData.rowID );

	if( rowData.collapsed ) {

		let _levels = levels.slice();
			_levels.pop();

		// tìm đến data cùng levels
		let Eq = findEq( dataSource, _levels );

		if( Eq && Eq.length ) {

			// tìm các collapse khác đang mở 
			Eq.forEach( data => {

				// nếu không phải collapse hiện tại và đang mở
				if( 
					data.value != rowData.value && 
					data.children && Array.isArray( data.children ) &&
					!data.collapsed
				 ) {

					// đóng collapse lại
					data.collapsed = true;

					if( changed.indexOf( data.rowID ) === -1 ) {

						changed.push( data.rowID );
					}
				}
			} );
		}
	}

	rowData.collapsed = !rowData.collapsed;

	changed.forEach( rowID => {

		dataSource[ rowID ] = { ...dataSource[ rowID ] };
	} );

	// tự động check
	if( !rowData.collapsed ) {

		dataSource = autoCheck( dataSource, levels, rowData.multiple );
	}

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows( dataSource )
	});

	this._dataSource = dataSource;
};