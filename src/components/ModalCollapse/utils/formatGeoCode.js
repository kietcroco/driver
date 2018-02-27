export default geoCode => {

	delete geoCode['photos'];
	delete geoCode['icon'];
	delete geoCode['reference'];
	delete geoCode['scope'];
	delete geoCode['id'];
	delete geoCode['adr_address'];

	return geoCode;
};