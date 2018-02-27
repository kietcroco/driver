"use strict";
//import moment from 'moment';
// import moment from 'moment/min/moment-with-locales';
import { moment, validateLocale } from '~/utilities/dateTimeFormat';
import I18n from '~/library/i18n/I18n';

/**
* @todo: Hàm trả về thời gian đã trải qua
* @author: Mr.Trọng
* @since: 04.02.2017
* @param:
*  -value: giá trị cần chuyển. (int, string, object, array)
*  -locale: ngôn ngữ hiển thị. (string: "vi","en",v.v..)
*  -suffix: có hiển thị chữ ago hay không. (bool: true||false)
* @return: String
*/
const timeAgo = ( value, locale: String, suffix: Boolean = true ) => {

	if( !value ) {

		return "";
	}

	// chuyển ngôn ngữ theo giá trị gọi hàm
	if (locale && locale !== I18n.locale ) {
		
		locale = validateLocale( locale );
		moment.locale( locale );
	}

	const result = moment( value ).fromNow( suffix );

	// chuyển về theo ngôn ngữ hiện tại
	if (locale && locale !== I18n.locale ) {

		moment.locale(validateLocale(I18n.locale));
	}

	//Trả về kết quả
	return result;
};

export default timeAgo;