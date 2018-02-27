"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from '~/configures/configureStore';
import configureAxios from '~/configures/configureAxios';
import SplashScreen from '~/components/SplashScreen';
import ToastContext from '~/library/Toast/ToastContext';
import Navigator from '~/modules';
import "./reducers/auth";

class Application extends React.PureComponent {

    static displayName = "@Application";

    constructor( props ) {
        super( props );

        const {
            store,
            persistor
        } = configureStore(ReducerRegistry.getReducers(), EpicRegistry.getEpics());

        this.store = store;
        this.persistor = persistor;
    }

    render() {

        return (
            <ToastContext>
                <Provider store={this.store}>
                    <PersistGate 
                        persistor = {this.persistor}
                        loading   = {<SplashScreen />}
                        // onBeforeLift = {() => {}}
                    >
                        <Navigator />
                    </PersistGate>
                </Provider>
            </ToastContext>
        );
    }

    componentDidMount() {

        const configureAuthRegistry = require('~/configures/configureAuthRegistry').default;

        this._eventChangeAuthorization = configureAuthRegistry(this.store);
        
        if (Platform.OS === "android") {

            const configureBackAndroid = require('~/configures/configureBackAndroid').default;

            this._eventGoBack = configureBackAndroid(this.store);
        }

        this._eventChangeAuthorizationAxios = configureAxios();
    }

    componentWillUnmount() {

        this._eventChangeAuthorization 
            && this._eventChangeAuthorization.remove
            && this._eventChangeAuthorization.remove()
        ;

        this._eventChangeAuthorizationAxios
            && this._eventChangeAuthorizationAxios.remove
            && this._eventChangeAuthorizationAxios.remove()
        ;
        
        this._eventGoBack 
            && this._eventGoBack.remove 
            && this._eventGoBack.remove()
        ;
    }
}

export default Application;