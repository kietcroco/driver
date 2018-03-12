"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import ProgressBar from '~/components/ProgressBar';
import SplashScreen from '~/components/SplashScreen';
import { colors, fontSizes, scale } from '~/configs/styles';

class Downloader extends React.PureComponent {

    static displayName = "@Downloader";

    static propTypes = {
        indeterminate: PropTypes.bool,
        progress: PropTypes.number,
        descriptionPrefix: PropTypes.string,
        description: PropTypes.string,
        onShow: PropTypes.func,
        onHide: PropTypes.func
    };

    static defaultProps = {
        descriptionPrefix: "",
        description: "",
        progress: 0,
        indeterminate: true
    };

    componentDidMount() {

        this.props.onShow && this.props.onShow();
    }

    render() {

        const {
            descriptionPrefix,
            description,
            progress,
            indeterminate = true
        } = this.props;

        return (
            <SplashScreen>
                <View style={_styles.progressBox}>
                    <Text style={_styles.description}>
                        {
                            !!descriptionPrefix && <Text style={_styles.descriptionPrefix}>{descriptionPrefix}: </Text>
                        }
                        {description}
                    </Text>
                    <ProgressBar
                        progress      = {progress}
                        style         = {_styles.progressBar}
                        color         = {colors.progressBarColor}
                        borderWidth   = {1}
                        indeterminate = {indeterminate}
                        height        = {4 * scale}
                        borderRadius  = {4 * scale}
                        borderColor   = {colors.progressBarBorderColor}
                    />
                </View>
            </SplashScreen>
        );
    }

    componentWillUnmount() {

        this.props.onHide && this.props.onHide();
    }
}

const _styles = {
    progressBox: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "10%",
        paddingBottom: "20%",
        justifyContent: "flex-end"
    },
    description: {
        color: colors.textSinkingColor,
        fontSize: fontSizes.small
    },
    descriptionPrefix: {
        color: colors.textSinkingColor,
        fontSize: fontSizes.small,
        fontWeight: "bold"
    },
    progressBar: {
        marginTop: 3 * scale
    }
};

export default Downloader;