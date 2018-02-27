"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, sizes, scale } from '~/configs/styles';

class FleetDetailRow extends React.Component {

    static displayName = "@FleetDetailRow";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        const { 
            style, onPress, title_detail, border_bottom, 
            style_view_outside_icon, icon_title,
            style_text_behind_icon, ...otherProps 
        } = this.props;

        let container = _styles.container_without_border;
        if (border_bottom && border_bottom === true) container = _styles.container;

        let view_inside_container = _styles.view_inside_container;
        if( (typeof style === "object") && (style !== null) ) {
            view_inside_container = [view_inside_container, style];
        }

        let style_view_icon = _styles.section.icon;
        if( (typeof style_view_outside_icon === "object") && (style_view_outside_icon !== null) ) {
            style_view_icon = [style_view_icon, style_view_outside_icon];
        }

        let css_text_behind_icon = _styles.text_behind_icon;
        if( (typeof style_text_behind_icon === "object") && (style_text_behind_icon !== null) ) {
            css_text_behind_icon = style_text_behind_icon;
        }

        let renderView = (
            <View style={view_inside_container}>
                <View style={style_view_icon} >
                    {icon_title}
                </View>
                <Text style={css_text_behind_icon}>
                    {title_detail}
                </Text>
            </View>
        );

        if (onPress && {}.toString.call(onPress) === '[object Function]') {
            renderView = (
                <TouchableOpacity
                    style={view_inside_container}
                    onPress={onPress}
                >
                    <View style={style_view_icon} >
                        {icon_title}
                    </View>
                    <Text style={css_text_behind_icon}>
                        {title_detail}
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={container}>
                {renderView}
            </View>
        );
    }
}

const _styles = {
    container: {
        borderBottomColor: colors.separatorBackgroundColor,
        borderBottomWidth: sizes.separatorHeight,
        padding: sizes.padding,
        marginTop: 1 * scale

    },
    container_without_border: {
        padding: 5 * scale
    },
    view_inside_container: {
        flexDirection: 'row'
    },
    section: {
        header: {
            flexDirection: 'row',
            paddingVertical: 2 * scale
        },
        textHeader: {
            fontSize: sizes.huge,
            fontWeight: 'bold'
        },
        status: {
            backgroundColor: colors.disableColor,
            width: 10 * scale,
            height: 10 * scale,
            borderRadius: 10 * scale,
            marginRight: sizes.spacing,
            opacity: .9
        },
        icon: {
            width: 20 * scale,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: sizes.padding
        },
        iconColor: {
            color: colors.disableColor
        }
    },
    text_behind_icon: {
        color: colors.textColor
    }
};


export default FleetDetailRow;
