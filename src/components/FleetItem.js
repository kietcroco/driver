
import { Text, View, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '~/components/Avatar';
import { sizes, colors } from '~/configs/styles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

/**
 * Thông tin phương tiện
 * @author duy.nguyen 23.02.2018
 */
class FleetItem extends Component {
    static displayName = '@FleetItem';

    static propTypes = {
        source: PropTypes.object.isRequired,
        state: PropTypes.string,
        onPress: PropTypes.func.isRequired
    };

    static defaultProps = {
        active: false
    }

    /**
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
    }

    /**
     * Hiển thị nút share nếu ở trang chi tiết
     * @author duy.nguyen 23.02.2018
     */
    _renderShare = (showShare, source) => {
        if (showShare) {
            return (<TouchableOpacity
                style={{ flexDirection: 'row', flex: 1 }}
                onPress={() => { onPress(source) }}
            >
                <View style={[_style.section.icon]} >
                    <EvilIcon name={'share-google'} size={20}
                        style={{ color: colorIconBus }}
                    />
                </View>
                <Text style={{ color: colorNormalText }}>
                    {source.fleets_name}
                </Text>
            </TouchableOpacity>);
        }
        return [];
    }
    /**
     * 
     */
    render() {

        let { source, state, showIcon, showBorder, showShare, onPress } = this.props;

        /**
         * Nếu ở trang chi tiết thì wrap trong View và hiển thị link share
         * Ở trang list thì wrapte trong Touch
         */
        let Wraper = !showShare ? TouchableOpacity : View;
        let textStatus, colorStatus, colorText, colorIcon;
        if (state == 'RUNNING') {
            statusText = 'Đang chạy';
            colorText = colors.primaryColor;
            colorNormalText = colors.textColor;
            colorStatus = colors.inputSuccessBorderColor;
            colorIconBus = colors.primaryColor;
            colorIconMap = '#e87801';
        } else if (state == 'STOP') {
            statusText = 'Nghỉ';
            colorText = colorStatus =
                colorIconBus = colorIconMap = colorNormalText = colors.disableColor;
        }
        return (
            <Wraper
                onPress={() => onPress(source)}
                style={[_style.container, showBorder && {
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd'
                }]} >
                <View style={_style.avatar}>
                    <Avatar source={source.fleets_small_image} />
                </View>
                <View style={_style.content}>
                    <View style={_style.section.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={[_style.section.textHeader, { color: colorText }]}>
                                {source.fleets_license_code}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <View style={[_style.section.status, { backgroundColor: colorStatus }]} />
                            <Text style={{ color: colorNormalText }}>{statusText} </Text>
                        </View>
                    </View>
                    <View style={_style.section.header}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={[_style.section.icon]} >
                                <FAIcon name={'bus'} size={14}
                                    style={{ color: colorIconBus }}
                                />
                            </View>
                            <Text style={{ color: colorNormalText }}>
                                {source.fleets_name}
                            </Text>
                        </View>
                        {
                            this._renderShare(showShare, source)
                        }
                    </View>
                    {
                        (state == 'RUNNING' && source.fleets_journey_name) &&
                        <View style={_style.section.header}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={[_style.section.icon]} >
                                    <FAIcon name={'map-marker'} size={14}
                                        style={{ color: colorIconMap }} />
                                </View>
                                <Text style={{ color: colorNormalText }}>{source.fleets_journey_name} </Text>
                            </View>
                        </View>
                    }

                </View>
                {showIcon && <View style={_style.arrow}>
                    <MCIcon name='chevron-right' size={20} />
                </View>}
            </Wraper>
        );
    }

}
const _style = {
    container: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: sizes.margin,
        paddingHorizontal: sizes.large
    },
    avatar: {
        width: '25%',
    },
    content: {
        width: '70%',
    },
    arrow: {
        width: '5%',
        justifyContent: 'center'
    },
    section: {
        header: {
            flexDirection: 'row',
            paddingVertical: 2
        },
        textHeader: {
            fontSize: sizes.huge,
            fontWeight: 'bold'
        },
        status: {
            backgroundColor: colors.disableColor,
            width: 10,
            height: 10,
            borderRadius: 10,
            marginRight: sizes.spacing,
            opacity: .9
        },
        icon: {
            width: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconColor: {
            color: colors.disableColor
        }
    }
};
export default FleetItem;