"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FleetDetailRow from '../../fleet/components/FleetDetailRow';
import * as JourneyService from '~/services/journey/journey';
import { colors, sizes, hitSlop, scale, fontSizes } from '~/configs/styles';

class History extends React.Component {

    static displayName = "@History";

    static navigationOptions = (navigation) => {
        return {
            "title": "Lịch sử hành trình"
        }
    };

    
    constructor(props) {
        super(props);
        this.state = {
			journeys: []
		};
    }

    componentDidMount() {
		let fleet_id = this.props.navigation.state.params.fleet_id;
		this.getJourneyByFleet(fleet_id);
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

		return renderDatas;

    }
    

    render() {

        return (
            <View style={_styles.container}>
				<View><Text>Lịch sử hành trình</Text></View>
				<ScrollView style={_styles.container}>
					<View style={_styles.fleet_history}>
						{(this.state.journeys.length > 0) && this._renderJourneyByFleet()}
					</View>
				</ScrollView>
            </View>
        );
    }
}

const _styles = {
    container: {
		flex: 1,
		marginVertical: sizes.margin,
		marginHorizontal: sizes.margin
	}
};

export default History;