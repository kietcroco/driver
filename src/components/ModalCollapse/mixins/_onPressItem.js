import checkItem from '../utils/checkItem';
import removeItem from '../utils/removeItem';
import uncheckAll from '../utils/uncheckAll';
import { Alert } from 'react-native';

export default function (rowData, sectionID, rowID, levels) {

	let dataSource = this._dataSource.slice();
	let count = dataSource.filter(val => {
		return val.checked === true;
	});
	if (this.props.limitItem && count.length == this.props.limitItem) {
		Alert.alert('Thông báo', `${'Bạn chỉ được phép chọn tối đa'} ` + this.props.limitItem);
		return;
	}
	if (!rowData.checked) {

		dataSource = checkItem(rowData, dataSource, levels);

	} else if (rowData.multiple) {

		rowData.checked = false;

		// nếu là phần tử được insert vào sau thì remove bỏ
		if (rowData.isInsert) {

			dataSource = removeItem(rowData, levels, dataSource);
		}
	}

	dataSource[rowID] = { ...dataSource[rowID] };

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows(dataSource)
	});

	this._dataSource = dataSource;

	if (!rowData.multiple && rowData.checked) {

		this._applyHandle();
	}
};