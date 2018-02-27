import { 
    numberFormat, 
    getCurrentDelimiters, 
    getDelimiters, 
    defaultFormat
} from '~/utilities/numberFormat';

const getDecimalLength = (format) => {

    format = `${format}`;
    let match = format.match(/\.\[?(0+)\]?/);
    if (match && match[1]) {

        return match[1].length;
    }
    return 0;
};
/**
 * @todo: Hàm hỗ trợ format số cho input number
 * @author: Croco
 * @since: 16-6-2017
 * @params: 
 *	text: giá trị number cần format, 
 *	format: chuỗi format
 *	locale: code ngôn ngữ cần format
*/
export default (text: String = "", format: String, locale: String) => {
    
    let delimiter = getCurrentDelimiters();
    let value = `${text}`;
    text = `${text}`;
    format = format || defaultFormat;

    // check và switch locale
    if (locale) {

        delimiter = getDelimiters(locale);
    }

    // bỏ format
    text = text.replace(new RegExp(`\\${delimiter.thousands}+`, "g"), "");

    // loại bỏ multi decimal
    let regexDecimal = new RegExp(`\\${delimiter.decimal}+$`);

    // kiểm tra có dấu thập phân ở cuối hay không
    if (regexDecimal.test(text)) {

        // replace tất cả dấu thập phân chừa lại dấu cuối cùng
        let regexDecimalMulti = new RegExp(`\\${delimiter.decimal}+`, "g");
        text = `${text.replace(regexDecimalMulti, "")}${delimiter.decimal}`;
    } 

    if (text !== "-") { // kiểm tra dấu -

        // kiểm tra nếu đang nhập số lẻ
        let decimalLength = getDecimalLength(format);
        let regexDecimalInput = new RegExp(`\\${delimiter.decimal}\\d{0,${decimalLength-1}}$`);
        if (regexDecimalInput.test(text)) {

            let matchNumber = text.match(new RegExp(`(\\d+)\\${delimiter.decimal}(\\d+)`));
            let number = text;
            if (matchNumber && matchNumber[1]) {

                number = `${numberFormat(matchNumber[1], format, locale)}${delimiter.decimal}${matchNumber[2]}`;
            }

            return number;
        }

        text = text ? numberFormat(text, format, locale) : "";

        // kiểm tra dữ liệu
        if (text != Infinity && `${text}` != "NaN") {

            value = text;
        }
    }

    return value;
};