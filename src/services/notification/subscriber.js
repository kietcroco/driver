import axios from 'axios';
import { apiDomain, apiNotification } from '~/configs/application';
import Registry from '~/library/Registry';
import { ONESIGNAL_PLAYER_ID, AUTHORIZATION, NOTIFICATION_TOKEN } from '~/constants/registryKey';

const url = `/notification/subscrice`;
const unSubscriceUrl = `/subscriber/unsubscrice`;

// hàm validate
export const validate = (credentials = {}) => {

	if (!Registry.get(ONESIGNAL_PLAYER_ID)) {

		return translate("Không thể đăng ký nhận thông báo");
	}
	return false;
};

const subscrice = () => {
	
	let errorMessage = validate({});
	if (errorMessage) {
		throw new Error(errorMessage);
		return;
	}

	// cancel request token
	const source = axios.CancelToken.source();
	const hl = getCurrentLanguage();

	const deferred = axios({
		url,
		baseURL: apiDomain,
		method: "post",
		cancelToken: source.token,
		headers: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		}
	});

	deferred.then(res => {

		if (
			res.status === 200 
			&& res.data.STATUS === "OK" 
			&& res.data.data 
			&& res.data.data.user_token
		) {

			Registry.set(NOTIFICATION_TOKEN, res.data.data.user_token);
		} else {

			Registry.delete(NOTIFICATION_TOKEN);
		}
	}).catch(() => {

		Registry.delete(NOTIFICATION_TOKEN);
	});

	deferred.abort = (message: String) => source.cancel(message);
	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

const unSubscrice = () => {

	// token đăng nhập notification
	let Authorization = Registry.get(NOTIFICATION_TOKEN);
	if (!Authorization.includes(" ")) {

		Authorization = "Bearer " + Authorization;
	}

	// cancel request token
	const source = axios.CancelToken.source();

	const deferred = axios({
		url: unSubscriceUrl,
		baseURL: apiNotification,
		method: "post",
		cancelToken: source.token,
		headers: {
			Accept: "application/json",
			Authorization,
			player_id: Registry.get(ONESIGNAL_PLAYER_ID)
		},
		data: {
			access_token: Registry.get(NOTIFICATION_TOKEN),
			player_id: Registry.get(ONESIGNAL_PLAYER_ID),
			hl
		}
	});

	deferred.abort = (message: String) => source.cancel(message);

	deferred.isCancel = thrown => axios.isCancel(thrown);

	return deferred;
};

export default {
	subscrice,
	unSubscrice
};