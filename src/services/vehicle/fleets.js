import axios from 'axios';
import { apiDomain, itemPerPage } from '~/configs/application';
const url = `/vehicle/vehicle`;

export const validate = (credentials = {}) => {

    if (
        !credentials["account_mobile"]
        || credentials["account_mobile"].length < 9
    ) {

        return translate("member.login.mobile_invalid");
    }

    return false;
};

export const get = (params = {}) => {
    const page = params["page"];
    const source = axios.CancelToken.source();
    const deferred = axios({
        url,
        baseURL: apiDomain,
        method: "GET",
        cancelToken: source.token,
        headers: {
            Accept: "application/json"
        },
        params
    });

    deferred.abort = (message: String) => source.cancel(message);

    deferred.isCancel = thrown => axios.isCancel(thrown);

    return deferred;
};

export const post = (data = {}) => {
    const source = axios.CancelToken.source();
    const deferred = axios({
        url,
        baseURL: apiDomain,
        method: "POST",
        cancelToken: source.token,
        headers: {
            Accept: "application/json"
        },
        data: {
            ...data
        }
    });

    deferred.abort = (message: String) => source.cancel(message);

    deferred.isCancel = thrown => axios.isCancel(thrown);

    return deferred;
};
export default {
    validate,
    get
};