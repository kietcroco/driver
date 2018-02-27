/**
 * @todo: Hàm format lại label theo nghiệp vụ
 * @author: Croco
 * @since: 22-4-2017
 * @param: address: object địa chỉ
 * @return: string label
*/
const formatLabel = ( address: Object ) => {

	if( !address ) return "";

	return (
			address.Establishment ||
			address.City && address.City.long_name || 
			address.State && address.State.long_name ||
			address.Country && address.Country.long_name
	);
};

export default formatLabel;