"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import I18n from './I18n';
import EventEmitter from '../Events/EmitEvent';

class I18nContext extends React.Component {

    static displayName = "@I18nContext";

    static childContextTypes = {
        locale: PropTypes.string,
        defaultLocale: PropTypes.string
    };

    static propTypes = {
        locale: PropTypes.string,
        defaultLocale: PropTypes.string,
        children: PropTypes.node.isRequired
    };

    static defaultProps = {
        locale: I18n.currentLocale(),
        defaultLocale: I18n.defaultLocale
    };

    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            locale: props.locale,
            defaultLocale: props.defaultLocale,
            children: props.children
        };
    }

    getChildContext() {
        return {
            locale: this.state.locale,
            defaultLocale: this.state.defaultLocale
        };
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.locale !== nextProps.locale) {

            this._handleChangeLocale(nextProps.locale);
        }

        if (this.props.defaultLocale !== nextProps.defaultLocale) {

            this._handleChangeDefaultLocale(nextProps.defaultLocale);
        }
        if (this.props.children !== nextProps.children && nextProps.children !== this.state.children ) {

            this.setState({
                children: nextProps.children
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.locale !== nextState.locale
            || this.state.waiting !== nextState.waiting
            || this.state.defaultLocale !== nextState.defaultLocale
            || this.state.children !== nextState.children
        );
    }

    render() {

        return this.state.children;
    }

    componentDidMount() {

        this._eventCurrentChange = EventEmitter.addListener('i18n.change.current-locale', this._handleChangeLocale);
        this._eventDefaultChange = EventEmitter.addListener('i18n.change.default-locale', this._handleChangeDefaultLocale);
        this._eventTranslationChange = EventEmitter.addListener('i18n.change.translation', this._handleChangeTranslation);
    }

    componentWillUnmount() {

        if (this._eventCurrentChange && this._eventCurrentChange.remove) {

            this._eventCurrentChange.remove();
        }
        if (this._eventDefaultChange && this._eventDefaultChange.remove) {

            this._eventDefaultChange.remove();
        }
    }

    // handle thay đổi dữ liệu ngôn ngữ
    _handleChangeTranslation = (translation) => {

        if (translation == this.state.locale && !this.state.waiting) {

            this.setState({
                waiting: true,
                children: null
            }, () => {
                this.setState({
                    waiting: false,
                    children: this.props.children
                });
            });
        }
    };

    // handle thay đổi ngôn ngữ hiện tại
    _handleChangeLocale = (locale) => {

        if (locale !== this.state.locale && !this.state.waiting) {

            this.setState({
                waiting: true,
                locale,
                children: null
            }, () => {
                this.setState({
                    waiting: false,
                    locale,
                    children: this.props.children
                });
            });
        }
    };

    // handle thay đổi ngôn ngữ mặc định
    _handleChangeDefaultLocale = (defaultLocale) => {

        if (defaultLocale !== this.state.defaultLocale && !this.state.waiting) {

            this.setState({
                waiting: true,
                defaultLocale,
                children: null
            }, () => {
                this.setState({
                    waiting: false,
                    defaultLocale,
                    children: this.props.children
                });
            });
        }
    };
}

export default I18nContext;