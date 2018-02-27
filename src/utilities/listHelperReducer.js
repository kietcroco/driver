import { itemPerPage } from '~/configs/application';
import * as fetchingActionType from '~/constants/fetchingActionType';

// hàm xử lý số page hiện tại
const DEFAULT_HANDLE_PAGE = (action = {}, data = []) => {

    let perPage = itemPerPage;

    if (action.meta) {

        perPage = action.meta.itemPerPage || itemPerPage;
    }

    return Math.ceil(data.length / perPage);
};

const initialState = {
    loading: false,
    refreshing: false,
    data: [],
    message: "",
    messageTitle: "",
    messageType: null,
    page: 0
};

export default (key, reducer, options = {}) => {

    const {
        handlePage = DEFAULT_HANDLE_PAGE
    } = options;


    return (state, action) => {

        // gọi reducer chính
        state = reducer(state, action);
        if (!Object.keys(state).length) {

            state = {
                ...initialState,
                ...state
            };
        }

        switch (action.type) {

            // bắt đầu load
            case `${key}#${fetchingActionType.FETCH_START}`:

                return {
                    ...state,
                    loading: true,
                    message: "",
                    messageTitle: "",
                    messageType: null,
                    refreshing: state.page < 1
                };

            // huỷ load
            case `${key}#${fetchingActionType.FETCHING_CANCEL}`:

                return {
                    ...state,
                    loading: false,
                    message: "",
                    messageTitle: "",
                    messageType: null,
                    refreshing: false
                };

            // lỗi
            case `${key}#${fetchingActionType.FETCHING_ERROR}`:

                return {
                    ...state,
                    loading: false,
                    message: action.payload.message,
                    messageTitle: action.payload.messageTitle,
                    messageType: "error",
                    refreshing: false
                };

            // load thành công
            case `${key}#${fetchingActionType.FETCHING_SUCCESS}`:

                let currentPage = state.page;
                let data = state.data;

                if (action.meta) {

                    currentPage = action.meta.page;
                }

                // nếu page đầu tiên thì không cộng dồn dữ liệu
                if (currentPage <= 1) {

                    data = action.payload.data;
                } else if (currentPage > state.page) {

                    data = [
                        ...state.data,
                        ...action.payload.data
                    ];
                }

                // số page hiện tại
                let page = handlePage(action, data);

                return {
                    ...state,
                    data,
                    page,
                    loading: false,
                    refreshing: false,
                    message: action.meta && action.meta.message,
                    messageTitle: action.meta && action.meta.messageTitle,
                    messageType: null
                };

            // refresh
            case `${key}#${fetchingActionType.REFRESH}`:
                return {
                    ...state,
                    data: [],
                    refreshing: true,
                    loading: true,
                    message: "",
                    messageTitle: "",
                    messageType: null,
                    page: 0
                };
        }

        return state;
    };
};