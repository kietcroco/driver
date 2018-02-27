import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Collapsible from '~/components/Collapsible';
import ArrowTranform from '~/components/ArrowTranform';
import { colors, scale, sizes, fontSizes } from '~/configs/styles';

class Group extends React.Component {

	static displayName = '@ModalCollapseGroup';

	static propTypes = {
		onPress: PropTypes.func,
		label: PropTypes.string.isRequired,
		multiple: PropTypes.bool,
		checked: PropTypes.bool,
		isHot: PropTypes.bool,
		level: PropTypes.number,
		children: PropTypes.node.isRequired,
		opened: PropTypes.bool
	};
	
	static defaultProps = {
		multiple: false,
		checked: false,
		isHot: false,
		level: 1,
		opened: false
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.opened !== nextProps.opened ||
			this.props.label !== nextProps.label ||
			this.props.multiple !== nextProps.multiple ||
			this.props.checked !== nextProps.checked ||
			this.props.isHot !== nextProps.isHot ||
			this.props.level !== nextProps.level ||
			this.props.children != nextProps.children ||
			this.props.onPress != nextProps.onPress
		);
	}

	render() {

		const { 
			children,
			label,
			level,
			opened,
			onPress
		} = this.props;

		const paddingLeft = level * sizes.margin;

		let mask = [];

		if( !opened ) {

			(Array.isArray(children) ? children : [children]).forEach( Item => {

				if( Item.props.checked || Item.props.isHot ) {

					mask.push( Item );
				}
			} );
		}

		return (
			<View style={ !opened ? mask && mask.length && _styles.containerHasMask : _styles.containerIsOpen }>
				<TouchableOpacity activeOpacity={ colors.activeOpacity } onPress={ onPress } style={ [_styles.item, {
					paddingLeft
				}] }>
					<Text numberOfLines={1} style={ _styles.label }>{ label }</Text>
					<ArrowTranform
						disable
						dir 		= { opened ? "up" : "down" }
					/>
				</TouchableOpacity>
				{ mask }
				<Collapsible
					collapsed 		= { !opened }
				>
					{ children }
				</Collapsible>
			</View>
		);
	}
}

const _styles = {
	containerIsOpen: {
		backgroundColor: colors.secondBackgroundColor
	},
	containerHasMask: {
		borderColor: colors.boldColor,
		borderBottomWidth: sizes.borderWidth,
		borderTopWidth: sizes.borderWidth
	},
	item: {
		height: sizes.rowItemHeight,
		alignItems: "center",
		borderBottomColor: colors.primaryBorderColor,
		borderBottomWidth: sizes.borderWidth,
		paddingRight: sizes.margin,
		flexDirection: "row"
	},
	label: {
		fontWeight: "bold",
		marginRight: sizes.spacing,
		color: colors.normalColor,
		fontSize: fontSizes.normal
	}
};

export default Group;