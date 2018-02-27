// "use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ActivityIndicator, ImageBackground as BaseImageBackground } from 'react-native';
import getUrl from './utils/getUrl';
import checkChangeSource from './utils/checkChangeSource';
import shallowEqual from 'fbjs/lib/shallowEqual';
import Downloader from '~/library/Downloader';

const ImageBackground = BaseImageBackground || Image;

// downloader cho image
const downloader = new Downloader({}, CacheManager.resolve('images'));

class ImageCache extends React.Component {

    static displayName = "@ImageCache";

    static propTypes = {
        ...Image.propTypes,
        animating: ActivityIndicator.propTypes.animating,
        loadingColor: ActivityIndicator.propTypes.color,
        loadingSize: ActivityIndicator.propTypes.size,
        hidesWhenStopped: ActivityIndicator.propTypes.hidesWhenStopped,
        errorSource: Image.propTypes.source
    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.state = {
            source: props.source,
            loading: true
        };
    }

    componentWillReceiveProps(nextProps) {

        if (
            checkChangeSource(this.props.source, nextProps.source)
        ) {

            let url = getUrl(nextProps.source);
            if (url) {

                return this.download(url);
            } else {

                this.setState({
                    loading: false,
                    source: nextProps.source
                });
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.loading !== nextState.loading
            || this.state.source != nextState.source
            || !shallowEqual(this.props, nextProps)
        );
    }

    render() {

        const {
            children,
            animating,
            loadingColor,
            loadingSize,
            hidesWhenStopped,
            ...otherProps
        } = this.props;
        var style = this.props.style;
        if (__DEV__ && (this.state.loading || children)) {

            const mergeStyle = require("~/library/mergeStyle").default;
            style = mergeStyle(style);
            style = {
                ...style
            };
            delete style.resizeMode;
        }

        if (this.state.loading) {

            return (
                <ActivityIndicator
                    style            = {style}
                    color            = {loadingColor}
                    animating        = {animating}
                    size             = {loadingSize}
                    hidesWhenStopped = {hidesWhenStopped}
                />
            );
        }

        const Component = children ? ImageBackground : Image;

        return (
            <Component
                {...otherProps}
                style   = {style}
                onError = {this._imageOnError}
                source  = {this.state.source}
            >
                {children}
            </Component>
        );
    }

    componentDidMount() {

        if( this.state.loading && typeof this.props.source !== "object" ) {

            this.setState({
                source: this.props.source,
                loading: false
            });
        } else {

            let url = getUrl(this.props.source);
            if (url) {

                this.download(url);
            }
        }
    }

    /**
     * @todo hàm download image và set state
     * @param url
     */
    download = (url = "") => {

        return new Promise(async (resolve, reject) => {

            !this.state.loading && this.setState({
                loading: true
            });

            try {

                url = await this._download(url);

                // set lại image source
                this.handleSource({
                    uri: url
                });
            } catch (error) {

                this.handleError();

                if (this.state.loading) {

                    this.setState({
                        loading: false
                    }, () => {

                        reject(error);
                    });
                } else {

                    reject(error);
                }
                return;
            }

            this.state.loading && this.setState({
                loading: false
            }, () => {

                resolve(url);
            });
        });
    };

    /**
     * @todo Hàm hỗ trợ download image và cache
     * @param url
     * @return Promise local path or uri base64
     */
    _download = (url) => {

        return new Promise(async (resolve, reject) => {

            // huỷ lần down trước đó
            try {
                await this.stopDownload();
            } catch (error) {}

            try {
                
                // tiến hành down
                this.request = downloader.download(url);
                const uri = await this.request;

                if ( uri ) {

                    return resolve(uri);
                }
            } catch (error) {
                
                return reject(error);
            }
            reject( new Error("download faild") );
        });
    };

    /**
     * @todo Hàm huỷ download
     */
    stopDownload = () => {

        return new Promise((resolve, reject) => {

            if (this.request) {

                if (!this.request.cancel) {
                    return reject("cannot cancel request");
                }
   
                this.request.cancel();
                this.request = undefined;
            }
            resolve();
        });
    };

    /**
     * @todo hàm xử lý lỗi hình
     */
    handleError = () => {

        if (this.state.source != this.props.errorSource) {

            this.setState({
                source: this.props.errorSource
            });
        }
    };

    /**
     * @todo hàm xử lý in hình
     */
    handleSource = (source) => {
        source = source || this.props.errorSource;

        this.state.source !== source && this.setState({
            source
        });
    };

    /**
     * @todo event image error
     */
    _imageOnError = (e) => {

        this.handleError(e);
        this.props.onError && this.props.onError(e);
    };
}

// config bỏ qua lỗi cảnh báo resizeMode cho ActivityIndicator
// console.ignoredYellowBox = console.ignoredYellowBox || [];
// console.ignoredYellowBox = [
//     ...console.ignoredYellowBox,
//     "Warning: Failed prop type: Invalid props.style key `resizeMode` supplied to `ActivityIndicator`.",
//     "Warning: Failed prop type: Invalid props.style key `resizeMode` supplied to `View`.",
// ];
if (__DEV__) {
    // const YellowBox = require('react-native').YellowBox;
    // YellowBox.ignoreWarnings([
    //     "Warning: Failed prop type: Invalid props.style key `resizeMode` supplied to `ActivityIndicator`.",
    //     "Warning: Failed prop type: Invalid props.style key `resizeMode` supplied to `View`.",
    // ]);
}

export default ImageCache;