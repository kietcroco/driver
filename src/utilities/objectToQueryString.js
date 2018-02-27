/**
 * @todo: Hàm chuyển object thành query string
 * @author: Croco
 * @since: 26-4-2017
 * @param:
 	* obj: object cần convert
 	* implodeArr: nếu là array thì chuyển thành dạng phân cách dấu ,
 	* prefix: parent key
 * @return: string
*/
const serialize = function(obj: Object, implodeArr: Boolean = false, prefix: String = "" ) {

	if( !obj ) return "";

	let str = [],
		prop;

	for(prop in obj) {

		if (obj.hasOwnProperty(prop)) {

			let key = prefix ? prefix + "[" + prop + "]" : prop, 
				value = obj[ prop ],
				_str
			;

			if( typeof value === "object" && ((implodeArr && !Array.isArray(value)) || !implodeArr) ) {

				_str = serialize( value, implodeArr, key );
			} else {

				_str = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			}

			str.push( _str );
		}
	}

	return str.join("&");
};

export default serialize;