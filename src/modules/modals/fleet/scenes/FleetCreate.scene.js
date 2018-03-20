"use strict";
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import TextInput from '~/components/TextInput';
import Button from '~/components/Button';
import ModalInput from '~/components/ModalInput';
import ModalCollapse from '~/components/ModalCollapse'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/configs/styles';
import * as FleetsService from '~/services/vehicle/fleets';
import AddImage from '~/components/AddImage';
// import getImagesFromSource from '~/utilities/getImagesFromSource';
import showImagePicker from '~/utilities/showImagePicker';

import { fleetTypes } from '../constants';

class FleetCreate extends React.Component {

	static displayName = "@FleetCreate";

	static navigationOptions = (navigation) => {
		return {
			title: translate('fleets.create.title'),
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
			fleets_license_code: '',
			// Loại xe: tải, bus...
			fleets_type: {
				value: [],
				label: 'Chọn loại xe',
				modalVisible: false,
				message: '',
				messageType: null,
			},
			fleets_attr_make: '', // Hãng sản xuất
			fleets_attr_model: '', // Model
			fleets_attr_weight: '', // tải trọng
			// images: getImagesFromSource({}),
			fleets_images: [],
		}
	}
	/**
	 * Sự kiện tạo mới phương tiện
	 */
	onCreateFleet = () => {
		let params = this.state;
		params['fleets_images'] = this.formatImage(params['fleets_images']);
		if (!params['fleets_license_code']) {
			Alert.alert(
				translate('alert.title'),
				translate('fleets.announce.fleets_license_code'),
				[
					{ text: 'OK' },
				],
				{ cancelable: false }
			);
		}
		if (!params['fleets_type']) {
			Alert.alert(
				translate('alert.title'),
				translate('fleets.announce.fleet_type'),
				[
					{ text: 'OK' },
				],
				{ cancelable: false }
			);
		} else {
			params['fleets_name'] = params['fleets_type'].label;
			params['fleets_type_code'] = params['fleets_type']['value'][0].value;
		}
		let res = FleetsService.post(params);
		res.then((res) => {
			if (res.data.STATUS == 'OK') {
				// this.props.dispatch({
				// 	type: `${key}#${fetchingActionType.REFRESH}`
				// });
				this.props.navigation.goBack();
			}
		});
	}
	/**
	 * Format hình ảnh base64
	 * @author duy.nguyen 26.02.2018
	 */
	formatImage = (images) => {
		let formatData = [];
		images.forEach(({ source = null, info = {} }) => {
			if (source) {

				if (typeof source === "object" && source["uri"]) {

					source = (source["uri"].split('base64,', 2))[1];

					formatData.push({
						...info,
						content: source
					});
				} else {
					formatData.push(source);
				}
			}
		});
		return formatData;
	}
	/**
	 * Sự kiện chọn loại phương tiện
	 */
	onChooseFleetType = (label, value) => {
		this.toggleModalFleetsType();
		this.setState({
			fleets_type: {
				value,
				label: label,
			}
		});
	}
	/**
	 * Toggle show hide modale
	 */
	toggleModalFleetsType = () => {
		this.setState({
			fleets_type: {
				...this.state.fleets_type,
				modalVisible: !this.state.fleets_type.modalVisible
			}
		});
	}

	/**
	 * Chọn hình ảnh cho phương tiện
	 */
	async _addImage() {
		try {
			// this.loading();
			const res = await showImagePicker();
			if (!res.didCancel && res.data) {

				const images = this.state.fleets_images.slice();
				images.push({
					source: { uri: `data:${res.type};base64,${res.data}` },
					info: {
						name: res.fileName,
						size: res.fileSize,
						type: res.type,
						width: res.width,
						height: res.height,
						isVertical: res.isVertical,
						originalRotation: res.originalRotation
					}
				});
				this.setState({
					fleets_images: images
				});
			}
		} catch (e) {
			Alert.alert(
				translate('image_picker.error.title'),
				translate('image_picker.error.text'),
				[
					{ text: 'OK' },
				],
				{ cancelable: false }
			);
		}
		// this.unloading();
	}

	render() {
		/** 
		 * Danh sách loại phương tiện theo ngôn ngữ 
		 */
		let curLang = Registry.get('currentLanguage') || 'vi';
		let fleetsType = fleetTypes[curLang];

		return (
			<View style={_style.container}>
				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						ref="fleets_license_code"
						placeholder={translate('fleets.attr.license_code')}
						required
						onChangeText={(fleets_license_code) => {
							this.setState({
								fleets_license_code
							});
						}}
					/>
				</View>
				<View style={_style.inputSection}>
					<ModalInput
						ref="bill_sender_inspect"
						//label={'Loại xe'}
						type="select"
						style={_style.modalInput}
						// labelStyle={_style.labelStyle}
						// returnKeyType="next"
						messageType={this.state.fleets_type.messageType}
						value={this.state.fleets_type.label}
						onPress={() => this.toggleModalFleetsType()}
						required
					>
						{this.state.fleets_type.message}
					</ModalInput>
					<ModalCollapse
						visible={this.state.fleets_type.modalVisible}
						value={this.state.fleets_type.value}
						translate={false}
						defaultValue={[]}
						source={fleetsType}
						title={"Chọn loại xe"}
						backHandle={() => this.toggleModalFleetsType()}
						onRequestClose={() => this.toggleModalFleetsType()}
						onInit={() => { }}
						onChange={this.onChooseFleetType.bind(this)}
						searchBar={false}
						maxLength={50}
					></ModalCollapse>
				</View>

				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.make')}
						required
						onChangeText={(fleets_attr_make) => {
							this.setState({
								fleets_attr_make
							});
						}}
					/>
				</View>

				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.model')}
						required
						onChangeText={(fleets_attr_model) => {
							this.setState({
								fleets_attr_model
							});
						}}
					/>
				</View>

				<View style={_style.inputSection}>
					<TextInput style={_style.textInput}
						placeholder={translate('fleets.attr.weight')}
						required
						onChangeText={(fleets_attr_weight) => {
							this.setState({
								fleets_attr_weight
							});
						}}
					/>
				</View>
				<View style={[_style.addImageWraper, { flexDirection: 'column' }]}>
					<View style={[_style.imageRow]}>
						{
							this.state.fleets_images.map(({ source = null, info = {} }, index) => {
								const onRemove = () => {
									const images = this.state.fleets_images.slice();
									images.splice(index, 1);
									this.setState({
										fleets_images: images
									});
								};

								return (
									<AddImage
										key={`images-${index}`}
										source={source}
										onError={onRemove}
										onRemove={onRemove}
										onPress={async () => {
											try {

												const res = await showImagePicker();

												if (!res.didCancel && res.data) {

													const images = this.state.fleets_images.slice();

													images[index] = {
														source: { uri: `data:${res.type};base64,${res.data}` },
														info: {
															name: res.fileName,
															size: res.fileSize,
															type: res.type,
															width: res.width,
															height: res.height,
															isVertical: res.isVertical,
															originalRotation: res.originalRotation
														}
													};

													this.setState({
														fleets_images: images
													})
												}
											} catch (e) {
												alert(translate('images_picker.error.text'));
											}
										}}
									/>
								);
							})
						}
						<AddImage
							onPress={this._addImage.bind(this)}
						/>

					</View>
				</View>

				<View style={_style.button}>
					<Button
						style={_style.btnSubmit}
						onPress={() => this.onCreateFleet.bind(this)}
						label={translate('fleets.create.create').toUpperCase()}
					/>
				</View>
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
	modalInput: {
		height: 40,
		// paddingHorizontal: sizes.padding
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	btnSubmit: {
		// height: 45,
		// width: 90
	},
	addImageTitleStyle: {
		fontSize: sizes.large,
		color: colors.primaryColor,
		fontWeight: "bold",
	},
	addImageWraper: {
		marginVertical: sizes.titleSpacing
	}
};

export default FleetCreate;