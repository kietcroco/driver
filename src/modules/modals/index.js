import member from './member';
import journey from './journey';
import fleet from './fleet';


// đăng ký router
const routeConfiguration = {
	...member,
	...journey,
	...fleet
};

export default routeConfiguration;