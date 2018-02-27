"use strict";
/**
* @todo: hàm string pad trong php
* @author: Croco
* @since: 20-9-2016
* @params: String input, Number length, String str, Enum pad, Boolean trim
* @return: String
*/
const STR_PAD_LEFT = -1;
const STR_PAD_BOTH = 0;

const str_pad = ( input = "", length: Number, str: String = " ", pad: Number = 1, trim: Boolean = true ) => {

	input = input.toString();
	str = str.toString();

	let result = Array( length - input.length + 1 ).join( str );

	if( STR_PAD_LEFT === pad ) {

		result = trim ? result.substr( result.length - (length - input.length) ) : result;

		return result + input;
	}

	else if( STR_PAD_BOTH === pad ) {

		let left = trim ? result.substr( result.length - Math.round( ( length - input.length ) / 2 ) ) : result;
		let right = trim ? result.substr( 0, parseInt( ( length - input.length ) / 2 ) ) : result;

		return left + input + right;
	}

	result = trim ? result.substr( 0, ( length - input.length ) ) : result;

	return input + result;
};

export default str_pad;
export {
	STR_PAD_LEFT,
	STR_PAD_BOTH,
	str_pad
};