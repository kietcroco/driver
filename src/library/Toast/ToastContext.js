"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Animated, AppState, Platform, ToastAndroid } from 'react-native';
import EventEmitter from '~/library/Events';
import Alias from '~/library/Alias';

class ToastConText extends React.Component {

    static displayName = "@ToastConText";

    // hàm config style
    static configStyle = ({style, messageStyle}) => {

        style = style || {};
        messageStyle = messageStyle || {};
        _styles.messageBox = {
            ..._styles.messageBox,
            ...style
        };
        _styles.message = {
            ..._styles.message,
            ...messageStyle
        };
    };

    static show = (message, duration) => {

        if (Platform.OS === "android" && AppState.currentState !== "active") {
            
            var options = {
                ...DEFAULT_CONFIG,
                message,
                duration
            };

            if (typeof message === "object") {
                options = {
                    ...options,
                    ...message
                };
            }

            if (!options.message && options.message !== 0) {
                return;
            }

            ToastAndroid.show(options.message, ToastAndroid.SHORT);
        } else {

            EventEmitter.emit("toast.show", {
                message, 
                duration
            });
        }
    };

    constructor( props ) {
        super( props );

        this.state = {
            isRunning: false,
            position: {
                top: _styles.messageBox.top,
                right: _styles.messageBox.right,
                bottom: _styles.messageBox.bottom,
                left: _styles.messageBox.left
            },
            style: {
                ..._styles.messageBox
            },
            messageStyle: {
                ..._styles.message
            },
            message: ""
        };

        this.opacityValue = new Animated.Value(0);
        this.queue = [];
    }

    shouldComponentUpdate( nextProps, nextState ) {
        
        return (
            this.state.message !== nextState.message
            || this.state.position !== nextState.position
            || this.state.isRunning !== nextState.isRunning
            || this.state.style !== nextState.style
            || this.state.messageStyle !== nextState.messageStyle
        );
    }

    render() {

        return (
            <View style={_styles.container}>
                { this.props.children }
                <View 
                    pointerEvents = "none"
                    style         = {_styles.toastBox}
                >
                    <Animated.View style={[_styles.messageBox, {
                        ...this.state.style,
                        ...this.state.position,
                        opacity: this.opacityValue
                    }]}>
                        <Text style={[_styles.message, this.state.messageStyle]}>{ this.state.message }</Text>
                    </Animated.View>
                </View>
            </View>
        );
    }

    componentDidMount() {

        this._eventToast = EventEmitter.addListener('toast.show', this._handleShow);
    }

    componentWillUnmount() {

        this.opacityValue.stopAnimation();
        if (this._eventToast && this._eventToast.remove) {

            this._eventToast.remove();
        }
        if( this.queue.length ) {

            this.queue.forEach( task => {

                if (task.timer) {
                    clearTimeout(task.timer);
                }
            } );
        }
    }

    _handleShow = ({ message, duration }) => {

        this.show(message, duration);
    };

    /**
     * @todo hàm hiển thị message
     */
    show = (message, duration) => {

        var options = {
            ...DEFAULT_CONFIG,
            message,
            duration
        };

        if (typeof message === "object" ) {
            options = {
                ...options,
                ...message
            };
        }

        if (!options.message && options.message !== 0) {
            return;
        }
        options.style = {
            ...this.state.style,
            ...options.style
        };
        options.position = {
            ...this.state.position,
            ...options.position
        };
        options.messageStyle = {
            ...this.state.messageStyle,
            ...options.messageStyle
        };
        options.duration = options.duration || DEFAULT_CONFIG.duration;

        var task = () => new Promise((resolve, reject) => {

            this.setState({
                position: {
                    ...this.state.position,
                    ...options.position
                },
                message: `${options.message}`,
                style: options.style,
                messageStyle: options.messageStyle
            }, () => {

                task.timer = setTimeout(() => {
                    resolve();
                }, options.duration);
            });
        });
        task.options = options;

        this.queue.push(task);
        this.excute();
    };

    /**
     * @todo hàm xử lý hàng đợi
     */
    excute = () => {

        if( !this.state.isRunning && this.queue.length ) {
            
            this.setState({
                isRunning: true
            }, () => {

                var excute = async () => {

                    var handle = this.queue[0];
                    var options = handle.options || {
                        ...DEFAULT_CONFIG
                    };

                    this.startOpacityAnimation(1, options.fadeInDuration);

                    try {

                        await handle();
                    } catch (error) { }

                    if (handle.timer) {
                        clearTimeout(handle.timer);
                    }

                    this.queue.splice(0, 1);

                    if (this.queue.length) {

                        excute();
                    } else {

                        this.setState({
                            isRunning: false
                        }, () => {

                            this.hide(options.fadeOutDuration);
                        });
                    }
                };

                excute();
            });
        }
    };

    /**
     * @todo hàm ẩn message
     */
    hide = async (duration) => {

        duration = duration || DEFAULT_CONFIG.fadeOutDuration;
        try {

            await this.startOpacityAnimation(0, duration);
        } catch (error) {}
        this.setState({
            isRunning: false,
            // message: ""
        });
    };

    /**
     * @todo hàm animation thay đổi opacity
     */
    startOpacityAnimation = (toValue, duration) => {

        const result = new Promise(async (resolve, reject) => {
            
            const animation = Animated.timing(
                this.opacityValue,
                {
                    toValue,
                    duration,
                    useNativeDriver: true
                }
            );

            try {

                // fake async
                await Promise.resolve();
                
                result.stop = () => {

                    if (animation && animation.stop) {

                        this.opacityValue.stopAnimation();
                        resolve();
                    } else {
                        reject(new Error("can't stop animation"));
                    }
                };

                this.opacityValue.stopAnimation();

                animation.start(({ finished }) => {

                    resolve(finished);
                });
            } catch (e) {
                reject(e);
            }
        });

        result.stop = () => {};

        return result;
    };

}

Alias.register("toast", (...args) => {

    ToastConText.show(...args);
});

const DEFAULT_CONFIG = {
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    duration: 1000
};

const _styles = {
    container: {
        flex: 1
    },
    toastBox: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: "absolute",
        zIndex: 100000,
        elevation: 99999,
        alignItems: "center",
        justifyContent: "flex-end",
        margin: 5
    },
    messageBox: {
        position: "absolute",
        backgroundColor: "#040404",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 30,
        bottom: 5
    },
    message: {
        color: "white",
        fontSize: 14
    }
};

export default ToastConText;