"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { initialRegion, LATITUDE_DELTA, LONGITUDE_DELTA } from '~/configs/map';
import MtIcon from 'react-native-vector-icons/MaterialIcons';
import { colors, scale, fontSizes } from '~/configs/styles';
import Header from './Header';

class ModalSelectLocation extends React.Component {

    static displayName = "@ModalSelectLocation";

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            region: initialRegion,
            marker: HCM_Coord
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        const {
            visible,
            onRequestClose,
            ...otherProps
        } = this.props;

        return (
            <Modal
                visible={visible}
                onRequestClose={onRequestClose}
                transparent={true}
            >
                <Header
                    backOnPress = {onRequestClose}
                    submitOnPress = {this._submit}
                />
                    
                <MapView
                    {...otherProps}
                    provider              = {MapView.PROVIDER_GOOGLE}
                    style                 = {_styles.mapView}
                    initialRegion         = {initialRegion}
                    region                = {this.state.region}
                    onPress               = {this._onPress}
                    cacheEnabled          = {true}
                    loadingEnabled        = {false}
                    showsMyLocationButton = {false}
                >
                    <MapView.Marker
                        coordinate = {this.state.marker}
                    />
                </MapView>

                <TouchableOpacity onPress={ this._onCurrentPress } style={_styles.myLocationButton} activeOpacity={ colors.activeOpacity }>
                    <MtIcon name="my-location" style={_styles.iconLocation}/>
                </TouchableOpacity>
            </Modal>
        );
    }

    componentDidMount() {

        this._onCurrentPress();
    }

    _submit = () => {

        
    };

    _onPress = (e) => {

        const {
            coordinate
        } = e.nativeEvent;

        this.setState({
            marker: coordinate,
            region: {
                ...coordinate,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
    };

    _onCurrentPress = () => {

        if ( this.props.currentPosition ) {

            return this.setState({
                marker: this.props.currentPosition,
                region: {
                    ...this.props.currentPosition,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });
        }
    };
}

const HCM_Coord = {
    latitude: 10.786516250757456,
    longitude: 106.67970132082701
};

const _styles = {
    mapView: {
        flex: 1
    },
    myLocationButton: {
        position: "absolute",
        bottom: 10 * scale,
        right: 10 * scale,
        backgroundColor: colors.primaryBackgroundColor,
        width: 60 * scale,
        height: 60 * scale,
        borderRadius: 30 * scale,
        justifyContent: "center",
        alignItems: "center"
    },
    iconLocation: {
        color: colors.textBoldColor,
        fontSize: 22
    }
};

export default ModalSelectLocation;