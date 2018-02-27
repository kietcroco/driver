import { View, Image } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageCache from '~/components/ImageCache';
import Header from './Header';
import { colors } from '~/configs/styles';

class Avatar extends Component {
    static displayName = "@ImageCache";

    static propTypes = {
        source: PropTypes.string
    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);
    }
    render() {
        let { source } = this.props;
        return (
            <View style={_style.avatar}>
                <ImageCache style={{ flex: 1, borderRadius: 7 }} source={{ uri: source }} />
            </View>
        );
    }
}
const _style = {
    avatar: {
        borderRadius: 7,
        borderWidth: 1,
        borderColor: colors.primaryBorderColor,
        height: 75,
        width: 75
    }
};
export default Avatar;