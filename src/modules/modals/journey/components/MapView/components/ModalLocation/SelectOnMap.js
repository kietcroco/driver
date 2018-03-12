"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import ModalSelectLocation from '../ModalSelectLocation';
import SectionBox from '~/components/SectionBox';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { sizes, fontSizes, colors, scale } from '~/configs/styles';

class SelectOnMap extends React.Component {

    static displayName = "@SelectOnMap";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor( props ) {
        super( props );

        this.state = {

            modalSelectVisible: false
        };
    }

    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return true;
    }

    render() {

        const {
            currentPosition,
            visible
        } = this.props;

        return (
            <View>
                <TouchableOpacity
                    activeOpacity = { colors.activeOpacity }
                    onPress = { this._onPress }
                >
                    <SectionBox style={_styles.section}>
                        <View style={_styles.iconBox}>
                            <MtIcon name="streetview" style={_styles.icon}/>
                        </View>
                        <View style={_styles.content}>
                            <Text style={_styles.text}>{translate("maps.select_location_on_map")}</Text>
                        </View>
                    </SectionBox>
                </TouchableOpacity>
                <ModalSelectLocation
                    visible         = {this.state.modalSelectVisible}
                    onRequestClose  = {this._modalSelectOnClose}
                    currentPosition = {currentPosition}
                />
            </View>
        );
    }


    _onPress = () => {

        this.setState({
            modalSelectVisible: true
        });
    };

    _modalSelectOnClose = () => {

        this.setState({
            modalSelectVisible: false
        });
    };
}

const _styles = {
    section: {
        marginHorizontal: sizes.margin,
        flexDirection: "row"
    },
    iconBox: {
        width: 60 * scale,
        height: 50 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        fontSize: 30 * scale,
        color: colors.textColor
    },
    content: {
        justifyContent: "center"
    },
    text: {
        fontSize: fontSizes.normal,
        color: colors.textColor
    }
};

export default SelectOnMap;