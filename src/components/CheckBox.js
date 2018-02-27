"use strict";
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

class CheckBox extends React.Component {

	static displayName = "@CheckBox";

	static propTypes = {
		disable: PropTypes.bool,
		checked: PropTypes.any,
		style: PropTypes.object
	};
	static defaultProps = {
		checked: false,
		disable: false
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.checked !== nextProps.checked ||
			this.props.disable !== nextProps.disable
		);
	}

	render() {

		return (
			<View style={ [_styles.container, this.props.disable && {
				backgroundColor: colors.disableColor
			},this.props.checked &&	 _styles.active, this.props.style] }>
				{
					this.props.checked && <FAIcon name="check" style={ _styles.iconCheck }/>
				}
			</View>
		);
	}
}

const _styles = {
	container: {
		width: 20 * scale,
		height: 20 * scale,
		borderRadius: 3 * scale,
		borderColor: colors.primaryBorderColor,
		borderWidth: 1 * scale,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center"
	},
	active:{
		borderColor: colors.primaryColor,
	},
	iconCheck: {
		borderColor: colors.primaryColor,
		color: colors.primaryColor,
		fontSize: fontSizes.large
	}
};

export default CheckBox;