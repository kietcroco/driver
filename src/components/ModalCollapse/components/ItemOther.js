import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import Radio from '~/components/Radio';
import Checkbox from '~/components/CheckBox';
import { colors, scale, sizes, fontSizes, hitSlop } from '~/configs/styles';

class ItemOther extends React.Component {

	static displayName = '@ModalCollapseItemOther';

	static propTypes = {
		onPress: PropTypes.func,
		label: PropTypes.string.isRequired,
		multiple: PropTypes.bool,
		checked: PropTypes.bool,
		isHot: PropTypes.bool,
		level: PropTypes.number,
		otherValue: PropTypes.string,
		otherLabel: PropTypes.string,
		onChange: PropTypes.func,
		isInput: PropTypes.bool,
		geolocation: PropTypes.bool,
		geoCode: PropTypes.object,
		keyword: PropTypes.string,
		placeholder: PropTypes.string,
		keepInput: PropTypes.bool,
		maxLength: PropTypes.number,
		keyboardType: PropTypes.string
	};

	static defaultProps = {
		multiple: false,
		checked: false,
		isHot: false,
		level: 1,
		otherValue: "",
		otherLabel: "",
		isInput: false,
		geolocation: false,
		geoCode: null,
		keyword: "",
		placeholder: "Nhập tỉnh khác",
		keepInput: false
	};

	constructor( props ) {
		super( props );

		this.state = {
			otherValue: props.otherValue,
			visible: false,
			geoCode: props.geoCode,
			keyword: props.keyword
		};

		this._onChangeText = this._onChangeText.bind(this);
		this._onPressOK = this._onPressOK.bind(this);
		this._onPressGeo = this._onPressGeo.bind(this);
		this._onRequestClose = this._onRequestClose.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {

		if( this.props.otherValue !== nextProps.otherValue && nextProps.otherValue !== this.state.otherValue ) {

			this.setState({
				otherValue: nextProps.otherValue
			});
		}

		if( this.props.geoCode != nextProps.geoCode && nextProps.geoCode != this.state.geoCode ) {

			this.setState({
				geoCode: nextProps.geoCode
			});
		}

		if( this.props.keyword != nextProps.keyword && nextProps.keyword != this.state.keyword ) {
			
			this.setState({
				keyword: nextProps.keyword
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		return (
			this.state.visible !== nextState.visible ||
			this.state.otherValue !== nextState.otherValue ||
			this.state.keyword !== nextState.keyword ||
			this.state.geoCode != nextState.geoCode ||
			this.props.label !== nextProps.label ||
			this.props.otherLabel !== nextProps.otherLabel ||
			this.props.multiple !== nextProps.multiple ||
			this.props.checked !== nextProps.checked ||
			this.props.isHot !== nextProps.isHot ||
			this.props.isInput !== nextProps.isInput ||
			this.props.level !== nextProps.level ||
			this.props.geolocation !== nextProps.geolocation ||
			this.props.placeholder !== nextProps.placeholder ||
			this.props.keepInput !== nextProps.keepInput ||
			this.props.maxLength !== nextProps.maxLength ||
			this.props.keyboardType !== nextProps.keyboardType ||
			this.props.onChange != nextProps.onChange ||
			this.props.onPress != nextProps.onPress
		);
	}

	_onChangeText( otherValue ) {
		this.setState({
			otherValue
		});
	}

	_onPressOK() {

		this.props.onChange && this.props.onChange( this.state.otherValue, this.state.geoCode, this.state.keyword );
	}

	_onRequestClose() {

		this.state.visible && this.setState({
			visible: false
		});
	}

	_onPressGeo() {

		!this.state.visible && this.setState({
			visible: true
		});
	}

	_onChange( value, geoCode, keyword ) {

		this.setState({
			otherValue: value,
			geoCode,
			keyword,
			visible: false
		});
	}

	_renderOther() {

		if( this.props.geolocation ) {

			return ([
				<TouchableOpacity onPress={ this._onPressGeo } activeOpacity={1} style={ _styles.otherInput } key="input-other">
					<Text numberOfLines={1} style={ [_styles.label, !this.state.otherValue && _styles.placeholder] }>
						{this.state.otherValue || this.props.placeholder}
					</Text>
				</TouchableOpacity>,
				<TouchableOpacity hitSlop={ hitSlop } activeOpacity={ colors.activeOpacity } key="touch-other" style={ _styles.btnOK } onPress={ this._onPressOK }>
					<Text style={ _styles.labelOK }>OK</Text>
				</TouchableOpacity>,
			]);
		}

		return ([
			<TextInput 
				style 					= { _styles.otherInput }
				underlineColorAndroid 	= "transparent"
				value 					= { this.state.otherValue }
				onChangeText 			= { this._onChangeText }
				//autoFocus 				= { true }
				selectTextOnFocus 		= { true }
				key 					= "input-other"
				placeholderTextColor 	= { colors.placeholderColor }
				maxLength 				= { this.props.maxLength }
				keyboardType 			= { this.props.keyboardType }
			/>,
			<TouchableOpacity hitSlop={ hitSlop } activeOpacity={ colors.activeOpacity } key="touch-other" style={ _styles.btnOK } onPress={ this._onPressOK }>
				<Text style={ _styles.labelOK }>OK</Text>
			</TouchableOpacity>
		]);
	}

	render() {

		const { 
			onPress,
			label,
			multiple,
			checked,
			level,
			isInput,
			otherLabel,
			geolocation
		} = this.props;

		const paddingLeft = { paddingLeft: (level + 1) * sizes.margin };

		return (

			<TouchableOpacity activeOpacity={ colors.activeOpacity } hitSlop={ hitSlop } onPress={ onPress } style={ [_styles.container, paddingLeft] }>
				<Text numberOfLines={1} style={ _styles.label }>{ otherLabel || label }</Text>
				{
					isInput &&
						<View style={ [_styles.otherInputWrapper, paddingLeft] }>
							{ this._renderOther() }
						</View>
				}
				{
					multiple ? 
						<Checkbox checked={ checked }/> : 
						<Radio checked={ checked } />
				}
			</TouchableOpacity>
		);
	}
}

const _styles = {
	container: {
		height: sizes.rowItemHeight,
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomColor: colors.primaryBorderColor,
		borderBottomWidth: sizes.borderWidth,
		paddingRight: sizes.margin,
		flexDirection: "row",
		position: "relative"
	},
	otherInputWrapper: {
		position: "absolute",
		right: 40 * scale,
		flexDirection: "row",
		top: 0,
		left: 0,
		bottom: 0,
		justifyContent: "center",
		paddingTop: 5 * scale,
		paddingBottom: 5 * scale
	},
	otherInput: {
		flex: 1,
		padding: 0,
		backgroundColor: "white",
		borderWidth: sizes.borderWidth,
		borderColor: colors.primaryBorderColor,
		borderRadius: sizes.borderRadius,
		justifyContent: "center",
		//fontSize: fontSizes.normal,
		//color: colors.normalColor
	},
	btnOK: {
		width: sizes.buttonNormal,
		height: "100%",
		backgroundColor: colors.secondBackgroundColor,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: sizes.borderRadius,
		marginLeft: sizes.margin
	},
	labelOK: {
		color: colors.normalColor,
		fontSize: fontSizes.normal
	},
	placeholder: {
		fontSize: fontSizes.normal,
		color: colors.placeholderColor
	},
	label: {
		color: colors.normalColor,
		fontSize: fontSizes.normal
	}
};

export default ItemOther;