import _backHandle from './_backHandle';
import _onRequestClose from './_onRequestClose';
import _buildData from './_buildData';
import _onPressItem from './_onPressItem';
import _onPressGroup from './_onPressGroup';
import _applyHandle from './_applyHandle';
import _clearHandle from './_clearHandle';
import _getSubmit from './_getSubmit';
import _onSearch from './_onSearch';
import _onPressItemOther from './_onPressItemOther';
import _onPressOtherOK from './_onPressOtherOK';
import _backup from './_backup';
import _restore from './_restore';

export default context => {

	context._dataSource = [];
	
	context._backHandle = _backHandle.bind(context);
	context._onRequestClose = _onRequestClose.bind(context);
	context._buildData = _buildData.bind(context);
	context._onPressItem = _onPressItem.bind(context);
	context._onPressGroup = _onPressGroup.bind(context);
	context._applyHandle = _applyHandle.bind(context);
	context._clearHandle = _clearHandle.bind(context);
	context._getSubmit = _getSubmit.bind(context);
	context._onSearch = _onSearch.bind(context);
	context._onPressItemOther = _onPressItemOther.bind(context);
	context._onPressOtherOK = _onPressOtherOK.bind(context);
	context._backup = _backup.bind(context);
	context._restore = _restore.bind(context);
};