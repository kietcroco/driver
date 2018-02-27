import { 
	getCurrentDelimiters, 
	getDelimiters, 
	validateLocale, 
	numeral 
} from '~/utilities/numberFormat';
import I18n from '~/library/i18n/I18n';

// chuẩn quốc tế
// const convertDelimiters = getDelimiters("en");

export default (value: String = "", locale: String) => {

	// kiểm tra locale
	if (locale && locale !== I18n.locale) {

		locale = validateLocale(locale);
		numeral.locale(locale);
	}

	const currentDelimiters = locale ? getDelimiters(locale) : getCurrentDelimiters();
	// const regexDecimal = new RegExp(`\\${currentDelimiters.decimal}`, "g");
	const regexThousands = new RegExp(`\\${currentDelimiters.thousands}`, "g");

	value = `${value}`;
	value = value.replace(regexThousands, "");
	// value = value.replace( regexDecimal, convertDelimiters.decimal );

	value = numeral(value).value();

	// set lại ngôn ngữ hiện tại
	if (locale && locale !== I18n.locale) {

		numeral.locale(validateLocale(I18n.locale));
	}

	return value;
};