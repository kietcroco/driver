import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { sizes, colors, scale, hitSlop } from '~/configs/styles';

class AddImage extends React.Component {

	static displayName = '@AddImage';

	static propTypes = {
		source: PropTypes.oneOfType([ // hình
			PropTypes.object,
			PropTypes.number,
			PropTypes.string
		]),
		onPress: PropTypes.func, // click add
		onRemove: PropTypes.func, // click remove
		onError: PropTypes.func // error image
	};

	shouldComponentUpdate(nextProps) {

		return (
			this.props.source != nextProps.source
		);
	}

	render() {

		const { source, onPress, onRemove, onError } = this.props;
		const imageSource = typeof source === "string" ? { uri: source } : (source || null);

		const Container = onPress ? TouchableOpacity : View;
		return (
			<Container style={_styles.container} onPress={onPress}>
				{
					!!imageSource &&
					<Image onError={onError} style={_styles.image} source={imageSource} />
				}
				{
					!!onPress &&
					<MTIcon name="add-a-photo" style={_styles.iconAdd} />
				}
				{
					!!onRemove &&
					<TouchableOpacity hitSlop={hitSlop} onPress={onRemove} style={_styles.iconDeleteWrapper}>
						<FAIcon name="times-circle" style={_styles.iconDelete} />
					</TouchableOpacity>
				}
			</Container>
		);
	}
}

const _styles = {
	container: {
		position: "relative",
		width: 90 * scale,
		height: 90 * scale,
		padding: sizes.spacing,
		borderWidth: sizes.borderWidth,
		borderColor: colors.primaryBorderColor,
		borderRadius: sizes.borderRadius,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: sizes.spacing,
		marginRight: sizes.spacing
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "contain"
	},
	iconAdd: {
		fontSize: 30 * scale,
		position: "absolute"
	},
	iconDeleteWrapper: {
		position: "absolute",
		top: 2 * scale,
		right: 4 * scale,
		justifyContent: "center",
		alignItems: "center"
	},
	iconDelete: {
		fontSize: 16 * scale,
		color: colors.highlightColor
	}
};

export default AddImage;