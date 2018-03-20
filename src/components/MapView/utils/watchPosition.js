import checkPermissionLocation from './checkPermissionLocation';
import { geoOptions } from '~/configs/map';

export default async ( successCallback, errorCallback ) => {

    try {

        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        let statuses = await checkPermissionLocation();

        if (statuses == "authorized") {

            return navigator.geolocation.watchPosition(
                successCallback,
                errorCallback,
                geoOptions
            );
        }

        errorCallback && errorCallback(new Error("permission denied"));
        return;
    } catch (error) {
        
        errorCallback && errorCallback(error);
    }
};