import { namespace } from './constants';

import Report from './scenes/Report.scene';

// đăng ký router
const routeConfiguration = {
	[namespace + "/report"]: { screen: Report }
};

export default routeConfiguration;