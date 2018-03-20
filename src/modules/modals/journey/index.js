import { namespace } from './constants';

import Report from './scenes/Report.scene';
import History from './scenes/History.scene';

// đăng ký router
const routeConfiguration = {
	[namespace + "/report"]: { screen: Report },
	[namespace + "/history"]: { screen: History }
};

export default routeConfiguration;