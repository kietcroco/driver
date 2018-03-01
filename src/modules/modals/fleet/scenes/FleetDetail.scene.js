"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import FleetItem from '~/components/FleetItem';
import FleetDetailRow from '../components/FleetDetailRow';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IOIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, sizes, hitSlop, scale } from '~/configs/styles';
import * as JourneyService from '~/services/journey/journey';

class FleetDetail extends React.Component {

	static displayName = "@Home";

	static navigationOptions = (navigation) => {
		return {}
	};

	constructor(props) {
		super(props);
		this.state = {
			journeys: []
		};
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
					onPress={() => { }}
					style={{ 'justifyContent': 'flex-end' }}
					style_view_outside_icon={{ 'marginRight': 0 }}
					style_text_behind_icon={{ 'color': colors.buttonSubmitBackgroundColor }}
					icon_title={(
						<FAIcon name={'arrow-right'} size={12}
							style={{ color: colors.primaryColor }}
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
								<MCIcon name={'delete-restore'} size={20}
									style={{ color: colors.primaryColor }}
								/>
							)}
						/>
						<FleetDetailRow
							title_detail={translate("feets_detail.update_feet")}
							onPress={() => { }}
							border_bottom={true}
							icon_title={(
								<IOIcon name={'md-create'} size={16}
									style={{ color: colors.primaryColor }}
								/>
							)}
						/>
						<FleetDetailRow
							title_detail={translate("feets_detail.history_journey")}
							onPress={() => { }}
							border_bottom={true}
							icon_title={(
								<MCIcon name={'map-marker'} size={20}
									style={{ color: '#e6786c' }}
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
					<TouchableOpacity style={_styles.start_schedule}>
						<Text style={{ color: colors.textSinkingColor }}>{translate("feets_detail.start_journey")}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

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
	fleet_history: {
		paddingHorizontal: sizes.large * 3
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
		paddingRight: 15 * scale,
		paddingLeft: 15 * scale
	}
}
export default FleetDetail;