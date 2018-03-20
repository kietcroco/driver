"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { colors, fontSizes, sizes } from '~/configs/styles';

class LocationView extends React.PureComponent {

    static displayName = "@LocationView";

    static propTypes = {
        source: PropTypes.shape({
            description: PropTypes.string,
            place_id: PropTypes.string,
            structured_formatting: PropTypes.shape({
                main_text: PropTypes.string,
                secondary_text: PropTypes.string
            }),
            types: PropTypes.array
        })
    };

    static defaultProps = {
    };

    render() {

        const {
            source
        } = this.props;

        if(!source){

            return null;
        }

        const {
            structured_formatting: {
                main_text,
                secondary_text
            } = {}
        } = source;

        return (
            <View style={_styles.container}>
                <Text numberOfLines={1} style={_styles.street}>{main_text}</Text>
                <Text numberOfLines={1} style={_styles.address}>{secondary_text}</Text>
            </View>
        );
    }
}

const _styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        borderBottomColor: colors.separatorBackgroundColor,
        borderBottomWidth: sizes.separatorHeight
    },
    street: {
        fontSize: fontSizes.normal,
        color: colors.textColor,
        width: "100%"
    },
    address: {
        fontSize: fontSizes.small,
        color: colors.textItalicColor,
        width: "100%"
    }
};

export default LocationView;