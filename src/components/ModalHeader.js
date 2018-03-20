import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { shadow, sizes, colors, fontSizes, scale, hitSlop } from '~/configs/styles';

class ModalHeader extends React.Component {

	static displayName = "@ModalHeader";

	static propTypes = {
		backHandle: PropTypes.func.isRequired,
		title: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.node
		]),
		children: PropTypes.node,
		backgroundColor: PropTypes.string,
		color: PropTypes.string
	};

	static defaultProps = {
		backgroundColor: colors.primaryColor,
		color: "white"
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.title !== nextProps.title ||
			this.props.backHandle != nextProps.backHandle ||
			this.props.children != nextProps.children ||
			this.props.children != nextProps.backgroundColor ||
			this.props.color != nextProps.color
		);
	}

	render() {

		const { backHandle, title, children, backgroundColor, color } = this.props;

		return (
			<View style={[_styles.container, { backgroundColor }]}>
				<TouchableOpacity hitSlop={hitSlop} style={_styles.btnBack} onPress={backHandle}>
					<FAIcon style={[_styles.iconBack, { color }]} name="chevron-left" />
				</TouchableOpacity>
				<View style={_styles.titleWrapper}>
					{
						typeof title === "string" ?
							<Text style={[_styles.title, { color }]} numberOfLines={1}>{title}</Text>
							: title
					}
				</View>
				<View style={_styles.headerRight}>
					{children}
				</View>
			</View>
		);
	}
}

const _styles = {
	container: {
		height: sizes.headerHeight,
		flexDirection: "row",
		backgroundColor: colors.primaryColor,
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: sizes.borderWidth,
		borderBottomColor: colors.primaryBorderColor
	},
	btnBack: {
		height: "100%",
		width: 30 * scale,
		alignItems: "center",
		justifyContent: "center"
	},
	iconBack: {
		color: colors.secondColor,
		fontSize: 16 * scale,
		marginTop: 2 * scale
	},
	titleWrapper: {
		// justifyContent: "center",
		marginLeft: -30 * scale
	},
	title: {
		color: "white",
		fontWeight: "bold",
		fontSize: fontSizes.large,
	},
	headerRight: {
		height: "100%",
		justifyContent: "center"
	}
};

export default ModalHeader;