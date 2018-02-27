"use strict";
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ListBasic from '~/components/ListBasic';
import FleetItem from '~/components/FleetItem';
import SearchInput from '~/components/SearchInput';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/configs/styles';

class Home extends React.Component {

	static displayName = "@Home";

	static navigationOptions = ({ navigation, screenProps }) => {
		// let title = Registry.get('authIdentity') ? Registry.get('authIdentity').account_fullname : 'Home';
		return {
			// title: '',
			headerRight: (<TouchableOpacity
				onPress={() => {
					navigation.navigate('/fleet/fleet-create');
				}}
				style={{
					width: 40,
					// height: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<MCIcon name='plus' size={22} style={{ color: '#fff' }} />
			</TouchableOpacity>)
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			textSearch: ''
		}
	}
	/**
	 * Sự kiện change tìm kiếm
	 */
	onChangeText = (text = '') => {
		this.setState({
			textSearch: text
		});
	};
	/**
	 * Submit tìm kiếm
	 * @author duy.nguyen 23.02.2018
	 */
	onSubmit = () => {
		this.props.actions.search(this.state.textSearch);
	}

	render() {
		return (
			<View style={{
				flex: 1
			}}>
				<View style={_style.input}>
					<SearchInput
						onChangeText={this.onChangeText}
						onSubmit={this.onSubmit}
					/>
				</View>
				{/* <TouchableOpacity onPress={() => {
					this.props.actions.fetch();
				}}><Text>fetch {this.props.reducers.page}</Text></TouchableOpacity>
				<TouchableOpacity onPress={() => {
					this.props.navigation.navigate('/notification');
				}}><Text>notification</Text></TouchableOpacity> */}

				<ListBasic
					reducers={this.props.reducers}
					actions={this.props.actions}
					params={this.props.navigation.state.params}
					renderItem={this._renderItem}
					keyExtractor={this._keyExtractor}
					onEndReachedThreshold={1}
				/>

			</View>
		);
	}

	/**
	 * Render từng phương tiện
	 */
	_renderItem = ({ item, index }) => {
		let state = item.fleets_state;
		return (
			<FleetItem
				source={item}
				state={state}
				showIcon={true}
				showBorder={true}
				onPress={(source) => {
					this.props.navigation.navigate('/fleet/fleet-detail', {source});
				}}
			/>
		);
	};

	_keyExtractor = (item, index) => {
		return `item-${index}`;
	};
}

const _style = {
	container: {

	},
	input: {
		margin: sizes.margin
	}
}
export default Home;