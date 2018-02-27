import axios from 'axios';
import { apiDomain } from '~/configs/application'
const url = 'base/register';

export default {
    validate: () => {

    },
    /**
     * Đăng ký tài khoản
     */
    post: (params = {}) => {
        // const seed = params["seed"];
        // const page = params["page"];

        const source = axios.CancelToken.source();
        const deferred = axios({
            url: url,
            baseURL: apiDomain,
            method: "POST",
            cancelToken: source.token,
            headers: {
                Accept: "application/json"
            },
            params // options
        });

        deferred.abort = (message: String) => source.cancel(message);

        deferred.isCancel = thrown => axios.isCancel(thrown);

        return deferred;
    }
}