"use strict";
// see doc http://numeraljs.com/
import numeral from 'numeral';
import 'numeral/locales';
import I18n from '~/library/i18n/I18n';
import { NUMBER_FORMAT } from '~/constants/format';

// sao chép vi-vn sang vi
numeral.locales["vi-vn"] = numeral.locales["vi"];
numeral.locales["en-us"] = numeral.locales["en"];

// ngôn ngữ mặc định
var defaultLocale = I18n.defaultLocale;

// hàm kiểm tra ngôn ngữ
const validateLocale = (locale: String = "") => {

	locale = locale.replace("_", "-").toLowerCase();
	if (numeral.locales[locale]) {

		return locale;
	}

	return defaultLocale;
};

defaultLocale = numeral.locales[validateLocale(I18n.defaultLocale)] ? validateLocale(I18n.defaultLocale) : "en";
// numeral.locale(defaultLocale);

// hàm chuyển đổi mệnh giá: "0,0.[000] a[k]" với k: enum: k, m, b, t
numeral.register('format', 'denominations', {
	regexps: {
		format: /a\[(?:k|m|b|t)\]/
	},
	format: function (value, format, roundingFunction) {

		value = value || 0;
		var mapping = {
			k: "thousand",
			m: "million",
			b: "billion",
			t: "trillion"
		};
		var abbreviations = {
			trillion: 12,
			billion: 9,
			million: 6,
			thousand: 3
		};
		// regex custom
		var regex = /a\[(k|m|b|t)\]/;
		// lấy mệnh giá trong format
		var match = format.match(regex) || [];
		var formatDenominations = mapping[match[1]];
		// trả format lại theo chuẩn
		format = format.replace(/a\[.+\]/, "a");
		//format = format.replace(regex, "a");

		// lấy hàm format
		var formater = numeral._.numberToFormat;
		if (
			numeral.formats["currency"] 
			&& numeral.formats["currency"].regexps.format.test(format)
		) {

			// lấy hàm format của tiền tệ
			formater = numeral.formats["currency"].format;
		}

		// nếu mệnh giá không tồn tại
		if (!formatDenominations || !abbreviations[formatDenominations]) {

			return formater(value, format, roundingFunction);
		}

		// lấy config ngôn ngữ hiện tại
		var locale = numeral.locales[numeral.locale()];

		// chuỗi format số không có mệnh giá, đơn vị tiền tệ
		var strFormatNumber = format.replace(/(?:a|\$)+/, "");

		// quy đổi số về đúng với mệnh giá
		var strNumber = value / Math.pow(10, abbreviations[formatDenominations]);
		// format lại số không có mệnh giá
		strNumber = formater(strNumber, strFormatNumber, roundingFunction) || "";
		
		// format số có mệnh giá + đơn vị tiền tệ
		var output = formater(value, format, roundingFunction) || "";
		
		// tạo regex xoá mệnh giá cũ
		var strRegexAbbr = [];
		var regxStrToRegx = /[.*+?^${}()|[\]\\]/g;
		for (let abbreviation in abbreviations) {
			
			let regexAbbr = locale.abbreviations[abbreviation].replace(regxStrToRegx, '\\$&');
			strRegexAbbr.push(regexAbbr);
		}
		strRegexAbbr = strRegexAbbr/*.sort((a, b) => (b.length - a.length))*/.join("|");
		strRegexAbbr = new RegExp(strRegexAbbr);

		// thay đổi mệnh giá
		output = output.replace(strRegexAbbr, locale.abbreviations[formatDenominations]);

		// thay đổi số
		output = output.replace(/(\d|\.|\,)+/, strNumber);

		return output;
	}
});
		
numeral.locale( validateLocale(I18n.locale) );


// hàm lấy config dấu thập phân theo ngôn ngữ
const getDelimiters = locale => {

	locale = validateLocale( locale );
	const numeralData = numeral.locales[locale] || numeral.locales[validateLocale(I18n.locale)] || numeral.locales[defaultLocale];

	return numeralData.delimiters;
};

// config thông số thập phân, phần nghìn hiện tại
const getCurrentDelimiters = () => getDelimiters(I18n.locale);

// format mặc định
const defaultFormat = NUMBER_FORMAT;

const numberFormat = (value, format, locale) => {

	format = format || defaultFormat;

	// kiểm tra locale
	if (locale && locale !== I18n.locale) {

		locale = validateLocale( locale );
		numeral.locale(locale);
	}

	// format number
	const result = numeral(`${value}`).format(format);

	// set lại ngôn ngữ hiện tại
	if (locale && locale !== I18n.locale ) {

		numeral.locale(validateLocale(I18n.locale));
	}

	//Trả về kết quả
	return result
};

export default numberFormat;

export {
	numberFormat,
	defaultFormat,
	getCurrentDelimiters,
	getDelimiters,
	validateLocale,
	numeral
};