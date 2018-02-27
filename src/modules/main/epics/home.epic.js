import { namespace } from '../constants';
import createEpicFetch from '~/utilities/createEpicFetch'; // helper hỗ trợ tạo epic fetching
import services from '~/services/vehicle/fleets';

const key = `${namespace}/home`;

export default EpicRegistry.register(key, createEpicFetch(key, services));