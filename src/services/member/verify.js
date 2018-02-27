import axios from 'axios';
import { apiDomain } from '~/configs/application';
import { AUTHORIZATION, AUTH_IDENTITY } from '~/constants/registryKey';

const url = `/base/verify`;

// hàm validate param comfirm active code
export const validate = (credentials = {}) => {

    if (
        !credentials["account_mobile"]
        || credentials["account_mobile"].length < 9
    ) {

        return translate("member.comfirm_active.mobile_invalid");
    }

    if (
        !credentials["account_active_code"]
        || credentials["account_active_code"].length != 6
    ) {

        return translate("member.comfirm_active.code_invalid");
    }

    return false;
};

// hàm comfirm active code
export const verify = (params = {}) => {

    let errorMessage = validate(params);
    if (errorMessage) {
        throw new Error(errorMessage);
        return;
    }

    const source = axios.CancelToken.source();
    // const headers = {};

    const deferred = axios({
        url,
        baseURL: apiDomain,
        method: "post",
        cancelToken: source.token,
        // headers,
        params,
        data: params
    });

    deferred.then(res => {

        if (
            res.status >= 200
            && res.status < 300
            && res.data
            && res.data["STATUS"] == "OK"
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
    verify
};