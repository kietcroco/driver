"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import FleetItem from '~/components/FleetItem';
import FleetDetailRow from '../components/FleetDetailRow';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IOIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, sizes, hitSlop, scale, fontSizes } from '~/configs/styles';
import * as JourneyService from '~/services/journey/journey';
import Permissions from 'react-native-permissions';
import { createClient } from '~/library/googlemaps';
import { geoOptions, google_api_key } from '~/configs/map';
import I18n from '~/library/i18n/I18n';

class FleetDetail extends React.Component {

	static displayName = "@Home";

	static navigationOptions = ({navigation}) => {
		const {
			state: {
				params: {
					source: {
						fleets_license_code
					} = {}
				} = {}
			}
		} = navigation;
		return {
			title: fleets_license_code
		};
	};

	constructor(props) {
		super(props);
		this.state = {
			journeys: [],
			fleet_id: null
		};

		this._task = [];
	}

	componentDidMount() {
		let source = this.props.navigation.state.params.source;
		this.getJourneyByFleet(source.fleets_id);
	}

	getJourneyByFleet(fleetId) {
		let params = {
			fleet_id: fleetId,
			url: '/journey/get-journey-by-fleet'
		};
		JourneyService.get(params).then((res) => {
			if (res.data && res.data.STATUS == 'OK') {
				this.setState({
					fleet_id: fleetId,
					journeys: res.data.data
				});
			}
		});
	}

	_renderJourneyByFleet() {
		let renderDatas = [];
		this.state.journeys.map((journeys, index) => {
			renderDatas.push(
				(
					<FleetDetailRow
						key={index}
						title_detail={journeys.journey_code}
						icon_title={(
							<FAIcon name={'bus'} size={12}
								style={{ color: colors.textSinkingColor, padding: 4 * scale }}
							/>
						)}
						style_view_outside_icon={{
							borderRadius: 120 * scale,
							backgroundColor: colors.primaryColor
						}}
					/>
				)
			);
		});

		if (this.state.journeys.length > 0)
			renderDatas.push(
				<FleetDetailRow
					key={this.state.journeys.length}
					title_detail={translate("feets_detail.feet_all")}
					onPress={() => { 
						this.props.navigation.navigate('/journey/history', {fleet_id: this.state.fleet_id});
					}}
					style={{ 'justifyContent': 'flex-end' }}
					style_view_outside_icon={{ 'marginRight': 0 }}
					style_text_behind_icon={{ 'color': colors.buttonSubmitBackgroundColor }}
					icon_title={(
						<FAIcon name={'arrow-right'} 
							style={{ color: colors.primaryColor, fontSize: fontSizes.small }}
						/>
					)}
				/>
			);
		return renderDatas;

	}
	render() {
		let item = this.props.navigation.state.params.source;
		let state = item.fleets_state;

		return (
			<View style={_styles.container}>
				<ScrollView style={_styles.container}>
					<View style={_styles.fleet_item}>
						<FleetItem
							source={item}
							state={state}
							showIcon={false}
							showBorder={false}
							showShare={true}
							onPress={() => { }}
						/>
					</View>
					<View style={_styles.fleet_title}>
						<FleetDetailRow
							title_detail={translate("feets_detail.delete_feet")}
							onPress={() => { }}
							border_bottom={true}
							icon_title={(
								<MCIcon name={'delete-restore'}
									style={_styles.style_icon}
								/>
							)}
						/>
						<FleetDetailRow
							title_detail={translate("feets_detail.update_feet")}
							onPress={() => { }}
							border_bottom={true}
							icon_title={(
								<IOIcon name={'md-create'}
									style={_styles.style_icon}
								/>
							)}
						/>
						<FleetDetailRow
							title_detail={translate("feets_detail.history_journey")}
							onPress={() => { }}
							border_bottom={true}
							icon_title={(
								<MCIcon name={'map-marker'}
									style={_styles.style_icon}
								/>
							)}
						/>
					</View>
					<View style={_styles.fleet_history}>
						{(this.state.journeys.length > 0) && this._renderJourneyByFleet()}
					</View>
					<View>
						<Text>Map here....</Text>
					</View>
				</ScrollView>
				<View style={_styles.view_start_schedule}>
					<TouchableOpacity style={_styles.start_schedule} onPress={ this._startOnPress }>
						<Text style={ _styles.text_start_schedule}>{translate("feets_detail.start_journey")}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	componentWillUnmount() {

		this._stopAllTask();
	}

	_startOnPress = async () => {

		// let params = {
		// 	fleet_id: fleetId,
		// 	url: '/journey/journey/create'
		// };
		// JourneyService.post(params).then((res) => {
		// 	if (res.data && res.data.STATUS == 'OK') {
		// 		this.props.navigation.navigate('/journey/report');
		// 	}
		// });
		
		let coords = {};
		let name = "";
		let place_id = "";
		let vicinity = "";
		let formatted_address = "";
		let address_components = [];
		let types = [];

		try {
			
			let position = await this._getCurrentPosition();

			if( position.coords.latitude === undefined || position.coords.longitude === undefined ) {
				throw new Error("unknown error");
			}

			coords = {
				...position.coords
			};
		} catch (error) {
			
			toast(error.message);
			return;
		}

		const googleClient = createClient({
			key: google_api_key,
			language: I18n.locale
		});


		let geos;
		try {
			
			// doi vi tri hien tai ra geolocation
			geos = await this._getGeocode(googleClient, coords);
		} catch (error) {}
		
		if( geos && geos.length ) {

			coords = {
				latitude: geos[0].geometry.location.lat,
				longitude: geos[0].geometry.location.lng,
			};
			address_components = geos[0].address_components;
			place_id = geos[0].place_id;
			types = geos[0].types;
			formatted_address = geos[0].formatted_address;
		} else {

			try {
				
				// lay geolocation gan do
				const nearbys = await this._getPlacesNearby(googleClient, coords);
	
				if( nearbys && nearbys.length ) {
	
					const geo = await this._getPlaceDetail(googleClient, nearbys[0].place_id);
					
					if( geo ) {
	
	
						coords = {
							latitude: geo.geometry.location.lat,
							longitude: geo.geometry.location.lng,
						};
						address_components = geo.address_components;
						place_id = geo.place_id;
						types = geo.types;
						formatted_address = geo.formatted_address;
						vicinity = geo.vicinity;
						name = geo.name;
					}
				}
			} catch (error) {}
		}

		let params = {
			latitude: coords.latitude,
			longitude: coords.longitude,
			place_id,
			vicinity,
			formatted_address,
			address_components,
			types,
			name
		};
	};

	_stopAllTask = () => {

		this._task.forEach( task => {

			task && task.cancel && task.cancel();
		} );

		this._task = [];
	};

	_getPlacesNearby = (provider, location) => {

		return new Promise(async ( resolve, reject ) => {

			try {
				
				var taskID = this._task.length;
				this._task[taskID] = provider.placesNearby({
					location,
					language: I18n.locale,
					rankby: "distance"
				}, (e, res) => {
					
					this._task.splice(taskID, 1);
					
					if( e ) {
						return reject(e);
					}

					if( res.status == 200 && res.json ) {

						if( res.json.status == "OK" ) {

							return resolve(res.json.results);
						}
						return reject( new Error(res.json.error_message || res.json.message || res.json.status) );
					}

					return reject( new Error( "unknown error" ));
				});

			} catch (error) {
				
				reject(error);
			}
		});
	};

	_getPlaceDetail = (provider, placeid) => {

		return new Promise(async ( resolve, reject ) => {

			try {
				
				var taskID = this._task.length;
				this._task[taskID] = provider.place({
					placeid,
					language: I18n.locale
				}, (e, res) => {
					
					this._task.splice(taskID, 1);
					
					if( e ) {
						return reject(e);
					}

					if( res.status == 200 && res.json ) {

						if( res.json.status == "OK" ) {

							return resolve(res.json.result);
						}
						return reject( new Error(res.json.error_message || res.json.message || res.json.status) );
					}

					return reject( new Error( "unknown error" ));
				});

			} catch (error) {
				
				reject(error);
			}
		});
	};
	
	_getGeocode = ( provider, latlng ) => {

		return new Promise(async ( resolve, reject ) => {

			try {
				
				var taskID = this._task.length;
				this._task[taskID] = provider.reverseGeocode({
					latlng,
					language: I18n.locale
				}, (e, res) => {
					
					this._task.splice(taskID, 1);
					
					if( e ) {
						return reject(e);
					}

					if( res.status == 200 && res.json ) {

						if( res.json.status == "OK" ) {

							return resolve(res.json.results);
						}
						return reject( new Error(res.json.error_message || res.json.message || res.json.status) );
					}

					return reject( new Error( "unknown error" ));
				});

			} catch (error) {
				
				reject(error);
			}
		});
	};

	// ham lay vi tri hien tai
	_getCurrentPosition = () => {

		return new Promise( async ( resolve, reject ) => {

			try {
				
				// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
				let statuses = await Permissions.check('location');

				if (statuses != "authorized") {
			
					// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
					statuses = await Permissions.request('location');
				}
				if (statuses == "authorized") {

					return navigator.geolocation.getCurrentPosition(
						(position) => {

							resolve(position);
						},
						(e) => {
	
							reject(e);
						},
						geoOptions
					);
				}

				return reject( new Error('access denied') );
			} catch (error) {
				reject(error);
			}
		} );
	};
}
const _styles = {
	container: {
		flex: 1
	},
	fleet_item: {},
	fleet_title: {
		marginVertical: sizes.margin,
		marginHorizontal: sizes.margin,
		borderTopColor: colors.separatorBackgroundColor,
		borderTopWidth: sizes.separatorHeight
	},
	style_icon: {
		color: colors.primaryColor,
		fontSize: 20 * scale
	},
	fleet_history: {
		paddingHorizontal: sizes.large * 3
	},
	text_start_schedule: {
		color: colors.textSinkingColor
	},
	view_start_schedule: {
		position: 'absolute',
		bottom: hitSlop.bottom * 1.3,
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	start_schedule: {
		backgroundColor: colors.buttonSubmitBackgroundColor,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5 * scale,
		borderRadius: sizes.buttonBorderRadius,
		paddingRight: sizes.large,
		paddingLeft: sizes.large
	}
}
export default FleetDetail;