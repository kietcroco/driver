import { namespace } from './constants';

import Login from './scenes/Login.scene';
import ComfirmCode from './scenes/ComfirmCode.scene';
import Register from './scenes/Register.scene';
// đăng ký router
const routeConfiguration = {
	[ namespace + "/login" ]: { screen: Login },
	[namespace + "/comfirm-code"]: { screen: ComfirmCode },
	[namespace + "/register"]: { screen: Register },
};

export default routeConfiguration;