import React from 'react';
import {
	Modal,
	ListView
} from 'react-native';
import ModalHeader from '~/components/ModalHeader';
import SearchBar from './components/SearchBar';
import Item from './components/Item';
import ItemOther from './components/ItemOther';
import Group from './components/Group';
import Footer from './components/Footer';
import mixins from './mixins';
import propTypes from './propTypes';
import defaultProps from './defaultProps';
import shallowEqual from 'fbjs/lib/shallowEqual';
import { colors } from '~/configs/styles';

class ModalCollapse extends React.Component {

	static displayName = '@ModalCollapse';

	static propTypes = propTypes;
	static defaultProps = defaultProps;

	constructor(props) {

		super(props);

		mixins(this);

		// tạo list data
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => {

				if (
					r1 !== r2 ||
					r1.checked !== r2.checked ||
					r1.collapsed !== r2.collapsed ||
					r1.isInput !== r2.isInput ||
					r1.isHidden !== r2.isHidden ||
					r1.children !== r2.children ||
					r1.otherValue !== r2.otherValue ||
					r1.otherLabel !== r2.otherLabel ||
					r1.value !== r2.value ||
					r1.label !== r2.label
				) {

					return true;
				}

				return false;
			}
		});

		this.state = {
			dataSource: ds.cloneWithRows(this._buildData(props.value, props.source)),
			searchKeyword: "",
			searchValue: "",
			isSearching: false
		};

		this._renderRows = this._renderRows.bind(this);
		this._renderRow = this._renderRow.bind(this);
		this._renderGroup = this._renderGroup.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (
			!shallowEqual(this.props.value, nextProps.value) ||
			!shallowEqual(this.props.source, nextProps.source) ||
			this.props.currentLanguage !== nextProps.currentLanguage
		) {

			const callBack = !nextProps.onInit ? undefined : () => {

				const { labels, values } = this._getSubmit();
				nextProps.onInit(labels.join(this.props.labelSeparate), values);
			};

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this._buildData(nextProps.value, nextProps.source))
			}, callBack);
		}

		if (nextProps.visible && this.props.visible !== nextProps.visible) {

			this.setState({
				searchKeyword: "",
				searchValue: ""
			});

			this._backup();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		return (
			this.state.isSearching !== nextState.isSearching ||
			this.state.searchValue !== nextState.searchValue ||
			this.state.searchKeyword !== nextState.searchKeyword ||
			this.state.dataSource._dataBlob.s1 != nextState.dataSource._dataBlob.s1 ||
			this.props.visible !== nextProps.visible ||
			this.props.labelApply !== nextProps.labelApply ||
			this.props.labelClear !== nextProps.labelClear ||
			this.props.maxLength !== nextProps.maxLength ||
			this.props.keyboardType !== nextProps.keyboardType ||
			this.props.otherPlaceholder !== nextProps.otherPlaceholder ||
			this.props.placeholder !== nextProps.placeholder
		);
	}

	_renderRow(rowData, sectionID, rowID, highlightRow, levels: Array = [], multiple: Boolean = this.props.multiple) {

		if (rowData.isOther) {

			return (
				<ItemOther
					{...this.props}
					onPress={() => this._onPressItemOther(rowData, sectionID, rowID, levels)}
					key={`${rowID}-${levels.join('-')}-${rowData.label}`}
					multiple={multiple}
					checked={rowData.checked}
					level={levels.length}
					label={rowData.otherLabel || rowData.label}
					otherValue={rowData.otherValue}
					isInput={rowData.isInput}
					isHot={rowData.isHot}
					onChange={(value, geoCode, keyword) => this._onPressOtherOK(rowData, sectionID, rowID, levels, { value, geoCode, keyword })}
					placeholder={this.props.otherPlaceholder}
				/>
			);
		}

		return (
			<Item
				onPress={() => this._onPressItem(rowData, sectionID, rowID, levels)}
				key={`${rowID}-${levels.join('-')}-${rowData.label}`}
				multiple={multiple}
				checked={rowData.checked}
				isHot={rowData.isHot}
				level={levels.length}
				label={rowData.label}
			/>
		);
	}

	_renderGroup(rowData, sectionID, rowID, highlightRow, levels: Array = []) {

		const multiple = rowData.hasOwnProperty('isMulti') ? rowData.isMulti : this.props.multiple;
		levels.push(rowData.value);

		return (
			<Group
				onPress={() => this._onPressGroup(rowData, sectionID, rowID, levels)}
				key={`${rowID}-${levels.join('-')}-${rowData.label}`}
				multiple={multiple}
				opened={!rowData.collapsed}
				checked={rowData.checked}
				isHot={rowData.isHot}
				level={levels.length}
				label={rowData.isOther && rowData.otherLabel || rowData.label}
			>
				{
					rowData.children.map(_rowData => this._renderRows(_rowData, sectionID, rowID, highlightRow, levels, multiple))
				}
			</Group>
		);
	}

	_renderRows(rowData, sectionID, rowID, highlightRow, levels: Array = [], multiple: Boolean = this.props.multiple) {

		rowData.rowID = rowID;
		rowData.multiple = multiple;

		if ((this.state.isSearching && rowData.isHidden)) return null;

		if (rowData.children && Array.isArray(rowData.children)) {

			return this._renderGroup(rowData, sectionID, rowID, highlightRow, levels);
		}
		return this._renderRow(rowData, sectionID, rowID, highlightRow, levels, multiple);
	}

	render() {

		const {
			visible,
			multiple,
			title = "Chọn",
			geolocation,
			searchToOther,
			keepInput,
			searchBar,
			placeholder,
			maxLength,
			keyboardType,
			labelApply = "Áp dụng",
			labelClear = "Bỏ chọn"
		} = this.props;

		return (
			<Modal
				visible={visible}
				animationType="fade"
				onRequestClose={this._onRequestClose}
			>
				<ModalHeader
					backHandle={this._backHandle}
					title={title}
				/>
				{
					searchBar && <SearchBar
						{...this.props}
						onSearch={this._onSearch}
						keyword={this.state.searchKeyword}
						value={this.state.searchValue}
						geolocation={geolocation}
						searchToOther={searchToOther}
						keepInput={keepInput}
						placeholder={placeholder}
						maxLength={maxLength}
						keyboardType={keyboardType}
					/>
				}
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderRows}
					initialListSize={30}
					pageSize={20}
					scrollRenderAheadDistance={40}
					enableEmptySections={true}
					keyboardDismissMode="interactive"
					keyboardShouldPersistTap="always"
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={true}
					horizontal={false}
					directionalLockEnabled={true}
					style={_styles.listView}
				/>
				<Footer
					clearHandle={this._clearHandle}
					applyHandle={multiple ? this._applyHandle : undefined}
					labelApply={labelApply}
					labelClear={labelClear}
				/>
			</Modal>
		);
	}

	componentDidMount() {

		if (this.props.onInit) {

			const { labels, values } = this._getSubmit();

			this.props.onInit(labels.join(this.props.labelSeparate), values);
		}

		if (this.props.visible) {

			this._backup();
		}
	}
}

const _styles = {
	listView: {
		backgroundColor: colors.modalBackground
	}
};

export default ModalCollapse;