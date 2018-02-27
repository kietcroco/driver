"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import Alias from '~/library/Alias';
import * as ALIAS from '~/configs/alias';
import I18n from '~/library/i18n/I18n';
import Registry from '~/library/Registry';
import ReducerRegistry from '~/library/ReducerRegistry';
import EpicRegistry from '~/library/EpicRegistry';
import { syncKey as accountSyncKey } from '~/configs/user';
import { AsyncStorage } from 'react-native';
import configureOneSignal from '~/configures/configureOneSignal';
import { AUTHORIZATION } from '~/constants/registryKey';

const {
    APPLICATION_ALIAS,
    CACHE_MANAGER,
    REGISTRY,
    REDUX_REGISTRY,
    EPIC_REGISTRY,
    HELPER_TRANSLATE
} = ALIAS;

const registry = new Registry();

class Loader extends React.PureComponent {

    static displayName = "@Loader";

    static propTypes = {
        version: PropTypes.string.isRequired
    };

    // init app
    static init() {

        return new Promise(async (resolve, reject) => {

            try {
                const authorization = await AsyncStorage.getItem(accountSyncKey);
                registry.set(AUTHORIZATION, authorization || null);

            } catch (error) {}

            resolve();
        });
    }

    constructor( props ) {
        super( props );

        // instance
        this._resolved = {};
        this.bootstrap();
        this.registerAlias();
    }

    componentWillReceiveProps( nextProps ) {

        // change version
        if( this.props.version !== nextProps.version ) {

            if (Alias.isRegistered(APPLICATION_ALIAS) && typeof Alias.get(APPLICATION_ALIAS) === "object") {

                Alias.get(APPLICATION_ALIAS).VERSION = nextProps.version;
            }
        }
    }

    render() {

        const {
            version
        } = this.props;

        const Application = require('./Application').default;
        const I18nContext = require('~/library/i18n/I18nContext').default;
        
        return (
            <I18nContext>
                <Application version={version}/>
            </I18nContext>
        );
    }

    bootstrap = () => {

        // this._resolved[CACHE_MANAGER] = new CacheManager(configCaches);
        this._resolved[CACHE_MANAGER] = CacheManager;
        this._resolved[REGISTRY] = registry;
        this._resolved[REDUX_REGISTRY] = new ReducerRegistry();
        this._resolved[EPIC_REGISTRY] = new EpicRegistry();
        this._resolved[HELPER_TRANSLATE] = (...args) => I18n.translate(...args);
    };

    // hàm đăng ký alias
    registerAlias = () => {

        const App = {
            resolve: this._resolve,
            reject: this._reject,
            VERSION: this.props.version
        };

        // đăng ký biến App
        Alias.register(APPLICATION_ALIAS, App);

        // nếu resolved có trong config alias thì đăng ký alias
        for (let name in ALIAS) {
            if (
                ALIAS.hasOwnProperty(name) 
                && this._resolved.hasOwnProperty(ALIAS[name])
            ) {
                
                Alias.register(ALIAS[name], this._resolved[ALIAS[name]]);
            }
        }
    };

    // hàm lấy instane
    _resolve = (name) => {
        
        if( this._resolved[name] === undefined ) {
            console.warn(`instance ${name} not loaded`);
        }

        return this._resolved[name];
    };

    // hàm huỷ instane
    _reject = (name) => {

        // this._resolved[name] === undefined;
        delete this._resolved[name];
    };
}

// cấu hình notification
configureOneSignal(registry);
export default Loader;