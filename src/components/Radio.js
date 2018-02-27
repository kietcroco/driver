"use strict";
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { colors, scale } from '~/configs/styles';

class Radio extends React.Component {
	
	static displayName = "@Radio";

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
			<View style={ [ _styles.container, this.props.disable && {
				backgroundColor: colors.disableColor
			},this.props.checked &&	 _styles.active, this.props.style ] }>
				{ this.props.checked && <View style={ _styles.checked }/>}
			</View>
		);
	}
}

const _styles = {

	container: {
		width: 20 * scale,
		height: 20 * scale,
		borderRadius: 10 * scale,
		borderColor: colors.primaryBorderColor,
		borderWidth: 1 * scale,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center"
	},
	active:{
		borderColor: colors.primaryColor,
	},
	checked: {
		backgroundColor: colors.primaryColor,
		width: 10 * scale,
		height: 10 * scale,
		borderRadius: 10 * scale,
	}
};

export default Radio;