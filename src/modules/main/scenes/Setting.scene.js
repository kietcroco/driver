"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import I18n from '~/library/i18n/I18n';
import ImageCache from '~/components/ImageCache';

class Setting extends React.Component {

    static displayName = "@Setting";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor( props ) {
        super( props );

    }

    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return true;
    }

    render() {

        return (
            <View>
                <Text>{translate("test.home")}</Text>
                <TouchableOpacity onPress={() => {

                    
                }}>
                    <Text>test epic</Text>
                </TouchableOpacity>
                <ImageCache source={{
                    uri: "http://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-2.jpg"
                }} style={{
                    width: "100%",
                    height: '100%',
                    resizeMode: "contain",

                }} />
            </View>
        );
    }

    componentDidMount() {

        setTimeout(() => {
            I18n.locale = "vi";
        }, 3000);
    }
}

const _styles = {
};

export default Setting;