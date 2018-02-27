"use strict";
//import moment from 'moment';
import moment from 'moment/min/moment-with-locales';
import I18n from '~/library/i18n/I18n';
import { DATE_FORMAT } from '~/constants/format';

// ngôn ngữ mặc định
var defaultLocale = I18n.defaultLocale;

// hàm kiểm tra ngôn ngữ
const validateLocale = (locale: String = "") => {

	locale = locale.replace("_", "-").toLowerCase();
	if( moment.locales().indexOf( locale ) !== -1 ) {
		
		return locale;
	}

	return defaultLocale;
};

defaultLocale = moment.locales().indexOf(validateLocale(defaultLocale)) !== -1 ? validateLocale(defaultLocale) : "en";

moment.locale(validateLocale(I18n.locale));

const DEFAULT_FORMAT = DATE_FORMAT;

const dateTimeFormat = (value, format, locale: String ) => {

	format = format || DEFAULT_FORMAT;

	// chuyển ngôn ngữ theo giá trị gọi hàm
	if (locale && locale !== I18n.locale ) {
		
		locale = validateLocale( locale );
		moment.locale( locale );
	}

	const result = moment(value).format(format);

	// chuyển về theo ngôn ngữ hiện tại
	if (locale && locale !== I18n.locale) {

		moment.locale(validateLocale(I18n.locale));
	}

	// format
	return result;
};

export {
	validateLocale,
	moment
};

export default dateTimeFormat;