import { namespace } from './constants';

import FleetDetail from './scenes/FleetDetail.scene';
import FleetCreate from './scenes/FleetCreate.scene';

// đăng ký router
const routeConfiguration = {
    [namespace + "/fleet-detail"]: { screen: FleetDetail },
    [namespace + "/fleet-create"]: { screen: FleetCreate }
};

export default routeConfiguration;