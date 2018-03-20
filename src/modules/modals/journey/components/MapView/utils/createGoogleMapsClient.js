import I18n from '~/library/i18n/I18n';
import { createClient } from '~/library/googlemaps';
// import { google_api_key, types as placeTypes } from '~/configs/map';
import { google_api_key } from '~/configs/map';

export default () => {

    return createClient({
        key: google_api_key,
        language: I18n.locale
    });
};