"use strict";
import React from 'react';
// import PropTypes from 'prop-types';
import { View } from 'react-native';
import { scale, colors, sizes } from '~/configs/styles';

class SectionBox extends React.PureComponent {

    static displayName = "@SectionBox";

    render() {

        var style = _style;
        if( this.props.style ) {
            
            style = [_style, this.props.style];
            if (Array.isArray(this.props.style)) {

                const mergeStyle = require("~/library/mergeStyle").default;
                style = [_style, mergeStyle(this.props.style)];
            }
        }

        return (
            <View style={style}>
                {this.props.children}
            </View>
        );
    }
}

const _style = {
    backgroundColor: colors.sectionBackgroundColor,
    margin: sizes.spacing,
    borderRadius: 3 * scale,
    padding: 2 * scale,
    // alignItems: "center",
    shadowOpacity: 0.2,
    shadowOffset: {
        width: 0,
        height: 1 * scale
    },
    shadowColor: colors.shadowColor,
    shadowRadius: 3 * scale,
    elevation: 2 * scale
};

export default SectionBox;