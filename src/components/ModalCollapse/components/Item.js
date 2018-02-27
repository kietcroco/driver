import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Radio from '~/components/Radio';
import Checkbox from '~/components/CheckBox';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

class Item extends React.Component {

	static displayName = '@ModalCollapseItem';

	static propTypes = {
		onPress: PropTypes.func,
		label: PropTypes.string.isRequired,
		multiple: PropTypes.bool,
		isHot: PropTypes.bool,
		checked: PropTypes.bool,
		level: PropTypes.number
	};

	static defaultProps = {
		multiple: false,
		checked: false,
		isHot: false,
		level: 1
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.label !== nextProps.label ||
			this.props.multiple !== nextProps.multiple ||
			this.props.checked !== nextProps.checked ||
			this.props.isHot !== nextProps.isHot ||
			this.props.level !== nextProps.level ||
			this.props.onPress != nextProps.onPress
		);
	}

	render() {

		const { 
			onPress,
			label,
			multiple,
			checked,
			level
		} = this.props;

		const paddingLeft = (level + 1) * sizes.margin;

		return (

			<TouchableOpacity activeOpacity={ colors.activeOpacity } onPress={ onPress } style={ [_styles.container, {
				paddingLeft
			}] }>
				<Text numberOfLines={1} style={ _styles.label }>{ label }</Text>
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
		flexDirection: "row"
	},
	label: {
		color: colors.normalColor,
		fontSize: fontSizes.normal
	}
};

export default Item;