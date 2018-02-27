const getRoute = ( state: Object = {} ) => {

	if( state.routes ) {

		return getRoute( state.routes[ state.index ] );
	}
	return state;
};

export default getRoute;