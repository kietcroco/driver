import PropTypes from 'prop-types';

// kiểu dữ liệu của value
const propTypeValues = PropTypes.arrayOf(PropTypes.shape({
	value: PropTypes.string.isRequired, // giá trị
	geoCode: PropTypes.object, // json geolocation
	keyword: PropTypes.string // từ khoá để search được geoCode
}));

export default {
	placeholder: PropTypes.string, // place holder searbar
	visible: PropTypes.bool,
	backHandle: PropTypes.func.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	multiple: PropTypes.bool,
	title: PropTypes.string,
	delimiter: PropTypes.string,
	separate: PropTypes.string,
	labelDelimiter: PropTypes.string,
	labelSeparate: PropTypes.string,
	defaultValue: propTypeValues,
	value: propTypeValues,
	source: PropTypes.arrayOf( // mảng config
		PropTypes.shape({
			value: PropTypes.string.isRequired, // giá trị item
			label: PropTypes.string.isRequired, // label hiển thị
			otherLabel: PropTypes.string, // label other
			otherValue: PropTypes.string, // giá trị other
			isMulti: PropTypes.bool, // là checkbox hoặc radio
			isOther: PropTypes.bool, // là tin khác (có input)
			isSelectAll: PropTypes.bool, // là item tất cả
			hideLabel: PropTypes.bool, // lấy label của parent ( vd: Việt Nam - tất cả => Việt Nam )
			autoCheck: PropTypes.bool, // là item tự động check khi mở group
			collapsed: PropTypes.bool, // true: đóng, false: mở
			checked: PropTypes.bool, // chọn
			geoCode: PropTypes.object, // json geocation
			keyword: PropTypes.string, // từ khoá để search được geoCode
			children: PropTypes.array // danh sách phần tử con
		})
	).isRequired,
	showParent: PropTypes.bool, // cho phép hiển thị label của cấp cha
	formatLabel: PropTypes.func, // hàm format label từ address
	geolocation: PropTypes.bool, // cho phép search geocomplete
	searchToOther: PropTypes.bool, // cho input search làm input other
	keepInput: PropTypes.bool, // cho xác nhận text trên geocomplete
	searchBar: PropTypes.bool, // thanh search
	onInit: PropTypes.func, // sự kiện init value ban đầu
	translate: PropTypes.bool, // cho phép dịch label
	maxLength: PropTypes.number, // Max length search
	limitItem: PropTypes.number, // Max số item được chọn
	keyboardType: PropTypes.string,
	labelApply: PropTypes.string, // label nút apply
	labelClear: PropTypes.string, // label nút xoá
	otherPlaceholder: PropTypes.string
};