"use strict";
import { namespace } from '../constants';
import * as fetchingActionType from '~/constants/fetchingActionType';
const key = `${namespace}/home`;

/**
 * Fetch dữ liệu danh sách phương tiện
 * @param {*} param0 
 */
export const fetch = ({ page = 1, seed = 1 } = {}) => {

    return {
        type: `${key}#${fetchingActionType.FETCH_START}`,
        meta: {
            api: "get", // tên hàm trong service
            page, // các giá trị truyền sang action tiếp theo (page: bắt buộc)
        },
        payload: [ // arguments truyền qua service
            {
                page
            }
        ]
    };
};
/** 
 * Refesh danh sách phương tiện
 * Dispatch qua hàm fetch()
 */
export const refresh = () => {

    return dispatch => {

        dispatch({
            type: `${key}#${fetchingActionType.REFRESH}`
        });
        dispatch(fetch({
            page: 1
        }));
    };
};

/** 
 * Tìm kiếm phương tiện phương tiện
 * Dispatch qua hàm fetch()
 * 
 * @author duy.nguyen 23.02.2.018
 */
export const search = (keyword) => {

    return dispatch => {
        dispatch({
            type: `${key}#${fetchingActionType.REFRESH}`
        });
        dispatch(fetch({
            page: 1,
            keyword
        }));
    };
};