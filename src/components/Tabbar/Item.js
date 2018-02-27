"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import TouchableOpacity from '~/components/TouchableOpacity';

class Item extends React.Component {

    static displayName = "@Item";

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
                
            </View>
        );
    }
}

const _styles = {
    
};

export default Item;