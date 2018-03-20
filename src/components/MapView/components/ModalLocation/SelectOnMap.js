"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import ModalSelectLocation from '../ModalSelectLocation';
import SectionBox from '../SectionBox';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { sizes, fontSizes, colors, scale } from '~/configs/styles';
import { initialRegion } from '~/configs/map';

class SelectOnMap extends React.Component {

    static displayName = "@SelectOnMap";

    static propTypes = {
        onSubmit: PropTypes.func,
        currentPosition: PropTypes.object,
        visible: PropTypes.bool,
        coordinate: PropTypes.object
    };

    static defaultProps = {
        visible: false
    };

    constructor( props ) {
        super( props );

        this.state = {
            modalSelectVisible: false
        };

        this._region = {
            ...initialRegion,
            ...props.coordinate
        };
    }

    componentWillReceiveProps(nextProps) {

        if( this.props.coordinate !== nextProps.coordinate ) {
            this._region = {
                ...this._region,
                ...nextProps.coordinate
            };
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return (
            this.state.modalSelectVisible !== nextState.modalSelectVisible
            || this.props.visible !== nextProps.visible
            || this.props.currentPosition !== nextProps.currentPosition
            || this.props.coordinate !== nextProps.coordinate
        );
    }

    render() {

        const {
            currentPosition,
            visible,
            coordinate
        } = this.props;

        if (!visible ) {

            return null;
        }

        return (
            <View>
                <TouchableOpacity
                    activeOpacity = { colors.activeOpacity }
                    onPress       = { this._onPress }
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
                {
                    this.state.modalSelectVisible &&
                        <ModalSelectLocation
                            visible         = {this.state.modalSelectVisible}
                            onRequestClose  = {this._modalSelectOnClose}
                            currentPosition = {currentPosition}
                            onSubmit        = { this._submit }
                            coordinate      = {coordinate}
                            region          = {this._region}
                            onRegionChange  = {this._onRegionChange}
                        />
                }
            </View>
        );
    }

    _onRegionChange = (region = {}) => {

        this._region = region;
    };

    // sự kiện click
    _onPress = () => {

        this.setState({
            modalSelectVisible: true
        });
    };

    // sự kiện đóng modal
    _modalSelectOnClose = () => {

        this.setState({
            modalSelectVisible: false
        });
    };

    // sự kiện nhấn ok => chọn vị trí
    _submit = ( coords = {} ) => {

        this.setState({
            modalSelectVisible: false
        }, () => {

            this.props.onSubmit && this.props.onSubmit(coords);
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