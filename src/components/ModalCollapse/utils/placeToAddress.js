/**
 * @todo: Hàm format geocode
 * @author: Croco
 * @since: 23-3-2017
 * @param: place: object json từ google
 * @return: object 
*/
export default ( place: Object = {} ) => {

	var address = {};
	let geometry = ( place.geometry && place.geometry.location ) || {};

	// địa danh
	if( place.types.indexOf('establishment') != -1 ) {

		address.Establishment = place.name;
	}

	place.address_components && place.address_components.length && place.address_components.forEach( c => {

		switch(c.types[0]){

			// số nhà
			case 'street_number':
				address.StreetNumber = c;
				break;

			// tên đường
			case 'route':
				address.StreetName = c;
				break;

			// thành phố
			case 'neighborhood': case 'locality':
				address.City = c;
				break;

			// tỉnh thành
			case 'administrative_area_level_1':
				address.State = c;
				break;

			// quận, huyện
			case 'administrative_area_level_2':
				address.District = c;
				break;

			// phường, xã
			case 'sublocality_level_1': case 'sublocality':
				address.Ward = c;
				break;

			// mã bưu điện
			case 'postal_code':
				address.Zip = c;
				break;

			// quốc gia
			case 'country':
				address.Country = c;
				break;
		}
	});

	// full địa chỉ
	address.fullAddress = place.formatted_address;

	// vị trí
	address.geolocation = {};
	address.geolocation.lat = typeof geometry.lat === "function" ? geometry.lat() : geometry.lat;
	address.geolocation.lng = typeof geometry.lng === "function" ? geometry.lng() : geometry.lng;
	address.geolocation.place_id = place.place_id;
	address.geolocation.location_type = geometry.location_type || place.types;

	return address;
};