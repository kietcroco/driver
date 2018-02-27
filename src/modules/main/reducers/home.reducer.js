import { namespace } from '../constants';
import listHelperReducer from '~/utilities/listHelperReducer'; // helper hỗ trợ tạo reducer load list

const key = `${ namespace }/home`;
const initialState = {
};

export default ReducerRegistry.register(key, listHelperReducer(key, (state = initialState, action ) => {

	return state;
}));