import * as AUTH from '~/constants/authReducerKey';
const key = AUTH.REDUCER_KEY;
const initialState = {
    authorization: null,
    authIdentity: null
};

export default ReducerRegistry.register(key, (state = initialState, action) => {

    switch (action.type) {
        case AUTH.LOGOUT:
        
            return {
                authorization: null,
                authIdentity: null
            };
        case AUTH.SET_AUTHORIZATION:

            return {
                ...state,
                authorization: action.payload
            };
        case AUTH.SET_AUTH_IDENTITY:

            return {
                ...state,
                authIdentity: action.payload
            };
        case AUTH.LOGIN:

            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
    return state;
});