import Permissions from 'react-native-permissions';

export default async () => {

    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    let statuses = await Permissions.check('location');

    if (statuses == "undetermined") {

        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        statuses = await Permissions.request('location');
    }

    return statuses;
};