import axios from 'axios';
import { apiNotification } from '~/configs/application';
import Registry from '~/library/Registry';
import { ONESIGNAL_PLAYER_ID, AUTHORIZATION, NOTIFICATION_TOKEN, UNREAD_NOTIFICATION_NUMBER } from '~/constants/registryKey';

const urlReceived = `/tracker/received`;
const urlOpened = `/tracker/opened`;
const urlGetUnread = `/tracker/get-unread`;
const urlResetUnread = `/tracker/reset-unread`;
const urlList = `/notification/list`;
const urlGet = `/notification/get`;

// hàm validate
export const validate = (credentials = {}) => {

	if (!Registry.get(ONESIGNAL_PLAYER_ID)) {

		return translate("Không tìm thấy thông tin thiết bị");
	}
	return false;
};

// hàm xác nhận đã nhận
const received = (notification_id) => {

	let errorMessage = validate({});
	if (errorMessage) {
		throw new Error(errorMessage);
		return;
	}

	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	const deferred = axios({
		url: urlReceived,
		baseURL: apiNotification,
		method: "post",
		cancelToken: source.token,
		headers: {
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID),
			access_token: Registry.get(NOTIFICATION_TOKEN) || "",
			notification_id
		}
	});

	deferred.abort = (message: String) => source.cancel(message);

	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

// hàm xác nhận đã xem
const opened = (notification_id) => {

	let errorMessage = validate({});
	if (errorMessage) {
		throw new Error(errorMessage);
		return;
	}

	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	const deferred = axios({
		url: urlOpened,
		baseURL: apiNotification,
		method: "post",
		cancelToken: source.token,
		headers: {
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID),
			access_token: Registry.get(NOTIFICATION_TOKEN) || "",
			notification_id
		}
	});

	deferred.abort = (message: String) => source.cancel(message);

	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

// hàm lấy số thông báo chưa đọc
const getUnread = () => {
	
	let errorMessage = validate({});
	if (errorMessage) {
		throw new Error(errorMessage);
		return;
	}

	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	const deferred = axios({
		url: urlGetUnread,
		baseURL: apiNotification,
		method: "post",
		cancelToken: source.token,
		headers: {
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID),
			access_token: Registry.get(NOTIFICATION_TOKEN) || ""
		}
	});

	deferred.abort = (message: String) => source.cancel(message);

	deferred.then(res => {

		if (res.status === 200 && res.data.STATUS === "OK") {

			let unread = Registry.get(UNREAD_NOTIFICATION_NUMBER) * 1 || 0;
			unread = ((res.data.data * 1) || 0) + unread;
			Registry.set(UNREAD_NOTIFICATION_NUMBER, unread);
		}
	});

	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

// hàm lấy số thông báo chưa đọc
const resetUnread = () => {
	
	let errorMessage = validate({});
	if (errorMessage) {
		throw new Error(errorMessage);
		return;
	}

	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	const deferred = axios({
		url: urlResetUnread,
		baseURL: apiNotification,
		method: "post",
		cancelToken: source.token,
		headers: {
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID),
			access_token: Registry.get(NOTIFICATION_TOKEN) || ""
		}
	});

	deferred.abort = (message: String) => source.cancel(message);

	deferred.then(res => {

		if (res.status === 200 && res.data.STATUS === "OK") {

			Registry.delete(UNREAD_NOTIFICATION_NUMBER);
		}
	});

	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

// hàm lấy danh sách thông báo
const get = (params: Object = {}) => {
	
	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	var url = urlList;
	if (params['notification_id']) {

		url = urlGet;
	}

	params['player_id'] = Registry.get(ONESIGNAL_PLAYER_ID);

	const deferred = axios({
		url,
		baseURL: apiNotification,
		method: "get",
		cancelToken: source.token,
		headers: {
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		params // options
	});

	deferred.abort = (message: String) => source.cancel(message);
	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

export default {
	received,
	opened,
	getUnread,
	resetUnread,
	get
};