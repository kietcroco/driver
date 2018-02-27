import axios from 'axios';
import { apiDomain } from '~/configs/application';
import { AUTHORIZATION, AUTH_IDENTITY } from '~/constants/registryKey';

const url = `/base/login`;

// hàm validate login
export const validate = (credentials = {}) => {

    if (
        !credentials["account_mobile"]
        || credentials["account_mobile"].length < 9
    ) {

        return translate("member.login.mobile_invalid");
    }

    return false;
};

// hàm đăng nhập
export const login = (params = {}) => {

    const source = axios.CancelToken.source();
    const headers = {};

    // nếu có access_token thì đăng nhập bằng token
    if (params["access_token"]) {

        headers["Authorization"] = params["access_token"];
    } else { // nếu không có token thì validate param

        let errorMessage = validate(params);
        if (errorMessage) {
            throw new Error(errorMessage);
            return;
        }
    }

    const deferred = axios({
        url,
        baseURL: apiDomain,
        method: "post",
        cancelToken: source.token,
        headers,
        params,
        data: params
    });

    deferred.then(res => {

        // nếu thành công và có token thì set lại token
        if (
            res.status >= 200
            && res.status < 300
            && res.data
            && res.data["STATUS"] == "AUTHENTICATED"
            && res.headers
            && res.headers["authorization"]
        ) {

            Registry.set(AUTHORIZATION, res.headers["authorization"]);
            if (res.data.data) {

                Registry.set(AUTH_IDENTITY, res.data.data);
            }
        } else {

            Registry.delete(AUTHORIZATION);
        }
    });

    deferred.catch(() => {
        Registry.delete(AUTHORIZATION);
    });

    deferred.abort = (message: String) => source.cancel(message);

    deferred.isCancel = thrown => axios.isCancel(thrown);

    return deferred;
};

export default {
    validate,
    login
};