import checkPermissionLocation from './checkPermissionLocation';
import { geoOptions } from '~/configs/map';

export default () => {

    return new Promise( async (resolve, reject) => {

        try {

            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            let statuses = await checkPermissionLocation();
            var timeID = setTimeout(() => {

                let e = new Error("Timeout expired");
                e.code = 3;
                reject(e);

                timeID && clearTimeout(timeID);
                timeID = undefined;
            }, (geoOptions.timeout && geoOptions.timeout + 10) || 30000);

            if (statuses == "authorized") {

                return navigator.geolocation.getCurrentPosition(
                    (position) => {

                        timeID && clearTimeout(timeID);
                        timeID = undefined;
                        resolve(position);
                    },
                    (e) => {

                        timeID && clearTimeout(timeID);
                        timeID = undefined;
                        reject(e);
                    },
                    geoOptions
                );
            }

            return reject(new Error("permission denied"));
        } catch (error) {

            reject(error);
        }
    } );
    
}