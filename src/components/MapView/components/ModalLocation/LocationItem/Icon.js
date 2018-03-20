"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { scale, colors, fontSizes, sizes } from '~/configs/styles';

class Icon extends React.PureComponent {

    static displayName = "@Icon";

    static propTypes = {
        name: PropTypes.oneOf([
            "history",
            "place"
        ]),
        distance: PropTypes.string
    };

    static defaultProps = {
        name: "place"
    };

    render() {

        return (
            <View style={_styles.container}>
                <MtIcon style={_styles.icon} name={this.props.name} />
                {
                    !!this.props.distance && 
                        <Text style={_styles.distance}>{this.props.distance}</Text>
                }
            </View>
        );
    }
}

const _styles = {
    container: {
        width: 60 * scale,
        height: 50 * scale,
        marginRight: sizes.spacing,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        color: colors.textItalicColor,
        fontSize: 30 * scale
    },
    distance: {
        fontSize: fontSizes.small,
        color: colors.textItalicColor
    }
};

export default Icon;