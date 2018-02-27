import checkItem from '../utils/checkItem';
import removeItem from '../utils/removeItem';

export default function( rowData, sectionID, rowID, levels ) {

	let dataSource = this._dataSource.slice();

	if( rowData.isInput && rowData.otherValue ) {

		rowData.isInput = !rowData.isInput;
		rowData.checked = !rowData.checked;
	} else {

		rowData.isInput = !rowData.isInput;
	}

	dataSource[ rowID ] = {...dataSource[ rowID ]};

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows( dataSource )
	});

	this._dataSource = dataSource;
};