import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

class Footer extends React.Component {

	static displayName = '@ModalCollapseFooter';

	static propTypes = {
		clearHandle: PropTypes.func.isRequired,
		applyHandle: PropTypes.func,
		labelApply: PropTypes.string,
		labelClear: PropTypes.string
	};

	static defaultProps = {
		labelApply: "Áp dụng",
		labelClear: "Bỏ chọn"
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.clearHandle != nextProps.clearHandle ||
			this.props.applyHandle != nextProps.applyHandle ||
			this.props.labelApply !== nextProps.labelApply ||
			this.props.labelClear !== nextProps.labelClear
		);
	}

	render() {

		const { clearHandle, applyHandle, labelApply, labelClear } = this.props;

		return (

			<View style={_styles.container}>
				{
					clearHandle && <TouchableOpacity activeOpacity={colors.activeOpacity} style={_styles.btnClear} onPress={clearHandle}>
						<Text style={_styles.labelClear}>{labelClear}</Text>
					</TouchableOpacity>
				}
				{

					applyHandle && <TouchableOpacity style={_styles.btnApply} onPress={applyHandle} activeOpacity={colors.activeOpacity}>
						<Text style={_styles.labelApply}>{labelApply}</Text>
					</TouchableOpacity>
				}
			</View>
		);
	}
}

const _styles = {
	container: {
		height: 40 * scale,
		flexDirection: "row",
		borderTopWidth: sizes.borderWidth,
		borderTopColor: colors.primaryBorderColor
	},
	btnClear: {
		flex: 1,
		backgroundColor: colors.secondBackgroundColor,
		alignItems: "center",
		justifyContent: "center"

	},
	labelClear: {
		fontSize: fontSizes.normal,
		color: colors.boldColor
	},
	btnApply: {
		flex: 1,
		backgroundColor: colors.primaryColor,
		alignItems: "center",
		justifyContent: "center"
	},
	labelApply: {
		color: colors.secondColor,
		fontSize: fontSizes.normal
	}
};

export default Footer;