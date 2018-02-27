
/**
 * @todo: Hàm tìm phần tử theo value
 * @author: Croco
 * @since: 18-3-2017
 * @param: data: nguồn, text: giá trị cần tìm
*/
const search = (data: Array = [], text: String = "") => {

	if (!data.length) return data;

	// cờ tìm được ở cấp con
	let isHidden = true, i;

	for (i = data.length - 1; i >= 0; i--) {

		// nếu có nhập thì hiển thị và ẩn nếu trùng khớp hoặc không
		if (text) {

			let _isHidden = true;

			// nếu là group
			if (data[i].children && Array.isArray(data[i].children)) {

				// tìm trong cấp con
				_isHidden = search(data[i].children, text);
				data[i].collapsed = false;
			}

			// nếu tìm thấy hoặc tìm được trong cấp con
			if ((data[i].label || data[i].otherValue || data[i].otherLabel).indexOf(text) !== -1 || !_isHidden) {

				isHidden = false;
				_isHidden = false;
			}

			// nếu trạng thái thay đổi
			//if( data[i].isHidden !== _isHidden || data[i].collapsed ) {

			data[i].isHidden = _isHidden;

			// tạo vùng nhớ mới
			if (data[i].children && Array.isArray(data[i].children)) {

				data[i].collapsed = _isHidden;
				data[i].children = data[i].children.slice();
			}

			data[i] = { ...data[i] };
			//}
		} else { // nếu không nhập thì hiển thị tất cả

			// nếu trạng thái có thay đổi
			//if( data[i].isHidden || !data[i].collapsed ) {

			if (data[i].children && Array.isArray(data[i].children)) {

				data[i].collapsed = true;
				data[i].children = data[i].children.slice();
				search(data[i].children, text);
			}
			data[i].isHidden = false;
			data[i] = { ...data[i] };
			//}
		}
	}

	return isHidden;
};

export default search;