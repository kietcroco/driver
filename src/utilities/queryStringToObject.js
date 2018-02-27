"use strict";

/**
* @todo: Hàm chuyển queryString thành object
* @author: croco
* @since: 20-1-2017
* @param query string
* @return object
*/
const queryStringToObject = queryString => {
	let obj = {};
	if(queryString) {
		let querySplit = queryString.split(/\?/);
		queryString = querySplit[ querySplit.length - 1 ];

		queryString && queryString.slice(1).split('&').map( item => {
			const [ k, v ] = item.split('=');
			v ? obj[k] = v : null
		});
	}
	return obj;
};

export default queryStringToObject;