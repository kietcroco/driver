"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { initialRegion } from '~/configs/map';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { colors, scale, fontSizes } from '~/configs/styles';

class ModalSelectLocation extends React.Component {

    static displayName = "@ModalSelectLocation";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor( props ) {
        super( props );

        this.state = {
            region: initialRegion
        };
    }

    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return true;
    }

    render() {

        const {
            ...otherProps
        } = this.props;

        return (
            <Modal 
                visible={true}
                onRequestClose={() => {}}
                transparent={false}
            >
                <View style={_styles.header}>
                    <TouchableOpacity style={_styles.btn} activeOpacity={colors.activeOpacity}>
                        <MtIcon name='arrow-back' style={_styles.iconBack} />
                    </TouchableOpacity>
                    <View style={_styles.titleBox}>
                        <Text style={_styles.title}>{translate("maps.select_location_on_map")}</Text>
                        <Text style={_styles.description}>{translate("maps.select_location_on_map_description")}</Text>
                    </View>
                    <TouchableOpacity style={_styles.btn} activeOpacity={colors.activeOpacity}>
                        <Text style={_styles.lblOk}>{translate("maps.select_location_on_map_submit")}</Text>
                    </TouchableOpacity>
                </View>
                <MapView
                    {...otherProps}
                    provider={MapView.PROVIDER_GOOGLE}
                    style={_styles.mapView}
                    initialRegion={initialRegion}
                    region={this.state.region}
                    
                    showsMyLocationButton={true}

                    cacheEnabled={true}
                    loadingEnabled={true}
                >
                    
                </MapView>
            </Modal>
        );
    }
}

const _styles = {
    mapView: {
        flex: 1
    },
    header: { 
        backgroundColor: colors.headerBackgroundColor,
        flexDirection: "row",
        height: 60 * scale
    },
    btn: {
        height: "100%",
        width: 60 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    titleBox: {
        flex: 1,
        justifyContent: "center",
        height: "100%"
    },
    iconBack: {
        fontSize: 30 * scale,
        color: colors.textSinkingColor
    },
    lblOk: {
        color: colors.textSinkingColor,
        fontSize: 20 * scale,
        fontWeight: "bold"
    },
    title: {
        fontSize: fontSizes.large,
        color: colors.textSinkingColor
    },
    description: {
        fontSize: fontSizes.small,
        color: colors.textSinkingColor
    }
};

export default ModalSelectLocation;