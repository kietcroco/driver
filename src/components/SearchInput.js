import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import { colors, sizes } from '~/configs/styles';
import FAIcon from 'react-native-vector-icons/FontAwesome';

class SearchInput extends Component {
    static displayName = "@SearchInput";

    static propTypes = {
        onChangeText: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        status: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        let { onChangeText, onSubmit } = this.props;
        return (
            <View style={[_style.container]}>
                <TextInput
                    style={_style.input}
                    onChangeText={typeof onChangeText == "function" && onChangeText}
                />
                <TouchableOpacity
                    style={_style.iconView}
                    onPress={typeof onSubmit == "function" && onSubmit}
                >
                    <FAIcon name="search" style={_style.icon} />
                </TouchableOpacity>
            </View>

        );
    }
}
const _style = {
    container: {
        // flex: 1,
        flexDirection: 'row',
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.primaryColor
    },
    input: {
        width: '85%',
        borderRadius: 20,
        paddingLeft: 20
    },
    iconView: {
        // backgroundColor: 'red',
        width: '15%',
        paddingRight: sizes.padding,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    icon: {
        color: colors.borderColor,
        fontSize: 20,
    }
};

export default SearchInput;