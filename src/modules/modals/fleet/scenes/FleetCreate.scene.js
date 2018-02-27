"use strict";
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TextInput from '~/components/TextInput';
import ModalInput from '~/components/ModalInput';
import ModalCollapse from '~/components/ModalCollapse'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/configs/styles';

class FleetCreate extends React.Component {

	static displayName = "@FleetCreate";

	static navigationOptions = (navigation) => {
		return {
			title: "Tạo mới phương tiện",
			// headerRight: (<TouchableOpacity style={{
			//     width: 40,
			//     // height: '100%',
			//     justifyContent: 'center',
			//     alignItems: 'center'
			// }}>
			//     <MCIcon name='plus' size={22} style={{ color: '#fff' }} />
			// </TouchableOpacity>)
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			// Biển số xe 
			fleets_license_code: {
				label: "",
				value: '',
				messageType: 'success',
				message: ""
			},
			// Loại xe: tải, bus...
			fleets_type_id: {
				value: [],
				modalVisible: false
			},
			fleets_attr_make: '', // Hãng sản xuất
			fleets_attr_model: '', // Model
			fleets_attr_weight: '', // tải trọng
		}
	}
	onCreateFleet = () => {

	}
	render() {
		return (
			<View style={_style.container}>
				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						ref="fleets_license_code"
						placeholder={translate('fleets.attr.license_code')}
						required
						onChangeText={(text) => {
							console.log(text);
						}}
					/>
				</View>
				<View style={_style.inputSection}>
					<ModalInput
						ref="bill_sender_inspect"
						label={'Loại xe'}
						type="select"
						style={_style.textInput}
						// labelStyle={_style.labelStyle}
						// returnKeyType="next"
						// messageType={this.state.bill_sender_inspect.messageType}
						// value={this.state.bill_sender_inspect.label}
						onPress={() => {
							console.log('fdafdafd');
							this.setState({
								fleets_type_id: {
									modalVisible: true
								}
							});
						}}
						required
					>{''}</ModalInput>
					<ModalCollapse
						visible={this.state.fleets_type_id.modalVisible}
						value={this.state.fleets_type_id.value}
						defaultValue={[]}
						source={[
							{
								value: 'CAN_VIEW',
								label: translate('Cho xem hàng, không cho thử')
							},
							{
								value: 'YES',
								label: translate('Cho thử hàng')
							},
							{
								value: 'NO',
								label: translate('Không cho xem hàng')
							}
						]}
						title={translate("Ghi chú bắt buộc")}
						backHandle={() => { }}
						onRequestClose={() => { }}
						onInit={() => { }}
						onChange={() => { }}
						searchBar={false}
						maxLength={50}
					></ModalCollapse>
				</View>

				{/* <View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.make')}
						required
						onChangeText={(text) => {
							console.log(text);
						}}
					/>
				</View> */}

				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.model')}
						required
						onChangeText={(text) => {
							console.log(text);
						}}
					/>
				</View>

				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.weight')}
						required
						onChangeText={(text) => {
							console.log(text);
						}}
					/>
				</View>
				<TouchableOpacity
					style={_style.button}
					onPress={this.onCreateFleet}>
					<Text>{translate('fleets.create')}</Text>
				</TouchableOpacity>
			</View>
		);
	}

}
const _style = {
	container: {
		flex: 1,
		paddingHorizontal: sizes.padding
	},
	inputSection: {
		borderBottomWidth: 1,
		borderBottomColor: colors.placeholderTextColor,
		marginBottom: sizes.padding
	},
	textInput: {
		height: 40,
		paddingHorizontal: sizes.padding
	},
	button: {

	}
};

export default FleetCreate;