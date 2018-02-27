"use strict";
import PropTypes from 'prop-types';
import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import MlIcon from 'react-native-vector-icons/MaterialIcons';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

class SearchBar extends React.Component {

	static displayName = "@SearchBar";

	static propTypes = {
		keyword: PropTypes.string,
		placeholder: PropTypes.string,
		onSearch: PropTypes.func,
		geolocation: PropTypes.bool,
		searchToOther: PropTypes.bool,
		keepInput: PropTypes.bool,
		maxLength: PropTypes.number,
		keyboardType: PropTypes.string
	};

	static defaultProps = {
		keyword: "",
		placeholder: translate("Tìm kiếm"),
		geolocation: false,
		searchToOther: false,
		keepInput: false
	};

	constructor( props ) {
		super( props );

		this.state = {
			visible: false,
			value: props.value,
			keyword: props.keyword
		};

		this._onRequestClose = this._onRequestClose.bind(this);
		this._onPress = this._onPress.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onChangeText = this._onChangeText.bind(this);
	}

	componentWillReceiveProps(nextProps) {

		if( nextProps.value !== this.state.value ) {

			this.setState({
				value: nextProps.value
			});
		}

		if( nextProps.keyword !== this.state.keyword ) {

			this.setState({
				keyword: nextProps.keyword
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		return (
			this.state.visible !== nextState.visible ||
			this.state.value !== nextState.value ||
			this.state.keyword !== nextState.keyword ||
			this.props.placeholder !== nextProps.placeholder ||
			this.props.geolocation !== nextProps.geolocation ||
			this.props.searchToOther !== nextProps.searchToOther ||
			this.props.keepInput !== nextProps.keepInput ||
			this.props.maxLength !== nextProps.maxLength ||
			this.props.keyboardType !== nextProps.keyboardType ||
			this.props.onSearch != nextProps.onSearch
		);
	}

	_onRequestClose() {

		this.state.visible && this.setState({
			visible: false
		});
	}

	_onPress() {

		!this.state.visible && this.setState({
			visible: true
		});
	}

	_onChange( value: String = "", geoCode: Object = null, keyword: String = "" ) {

		if( this.props.geolocation ) {

			this.state.visible && this.setState({
				visible: false,
				value,
				keyword
			}, () => {

				this.props.onSearch && this.props.onSearch( value, geoCode, keyword );
			});
		} else if( this.props.searchToOther ){

			this.props.onSearch && this.props.onSearch( value, geoCode, keyword );
		}
	}

	_onChangeText( text: String = "" ) {

		this.setState({
			value: text
		});

		if( !this.props.searchToOther && this.props.onSearch ) {

			this.props.onSearch( text );
		}
	}
	
	render() {

		const {
			placeholder,
			value,
			keyword,
			geolocation,
			searchToOther,
			keepInput,
			maxLength,
			keyboardType,
			...otherProps,
		} = this.props;

		return (
			<View style={ _styles.container }>
				<TouchableOpacity activeOpacity={ 1 } style={ _styles.textInputWrapper } onPress={ geolocation ? this._onPress : undefined }>
					<MlIcon name="search" style={ _styles.iconSearch }/>
					{
						geolocation ?
							<Text numberOfLines={1} style={ [_styles.label, !this.state.value && _styles.placeholder] }>{ this.state.value || placeholder }</Text>
						: <TextInput 
								style 					= { _styles.textInput }
								returnKeyType 			= {searchToOther ? "done" :"search"}
								underlineColorAndroid 	= "transparent"
								selectTextOnFocus 		= { true }
								placeholder 			= { placeholder }
								placeholderTextColor 	= { colors.placeholderColor }
								onChangeText 			= { this._onChangeText }
								value 					= { this.state.value }
								onSubmitEditing 		= { ({nativeEvent: {text}}) => this._onChange(text) } 
								maxLength 				= { maxLength }
								keyboardType 			= { keyboardType }
						  />
					}
				</TouchableOpacity>
				
			</View>
		);
	}
}

const _styles = {
	container: {
		height: sizes.rowItemHeight,
		backgroundColor: colors.secondBackgroundColor,
		paddingLeft: sizes.margin,
		paddingRight: sizes.margin,
		justifyContent: "center",
		borderBottomColor: colors.primaryBorderColor,
		borderBottomWidth: sizes.borderWidth
	},
	textInputWrapper: {
		height: 22 * scale,
		backgroundColor: "white",
		borderWidth: sizes.borderWidth,
		borderColor: colors.primaryBorderColor,
		position: "relative",
		justifyContent: "center",
		paddingLeft: 22 * scale
	},
	iconSearch: {
		position: "absolute",
		left: sizes.spacing,
		fontSize: 15 * scale,
		color: colors.placeholderColor
	},
	placeholder: {
		fontSize: fontSizes.normal,
		color: colors.placeholderColor
	},
	label: {
		fontSize: fontSizes.normal,
		color: colors.normalColor
	},
	textInput: {
		flex: 1,
		padding: 0,
		fontSize: fontSizes.normal,
		color: colors.normalColor
	}
};

export default SearchBar;