"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { InteractionManager, Alert, Platform, AsyncStorage } from 'react-native';
import CodePush from "react-native-code-push";
import I18n from '~/library/i18n/I18n';
import DeviceInfo from 'react-native-device-info';
import CacheManagerClass from '~/library/Cache/CacheManager';
import configCaches from '~/configs/cache';
import configureI18n from '~/configures/configureI18n';
import { CACHE_MANAGER } from '~/configs/alias';
import Alias from '~/library/Alias';

const CacheManager = new CacheManagerClass(configCaches);
const I18nCache = CacheManager.resolve('i18n');

// đăng ký biến App
Alias.register(CACHE_MANAGER, CacheManager);

// require sau khởi tạo Cache
const Downloader = require('~/components/Downloader').default;
const Application = require('~/application').default;

class Updater extends React.Component {

    static displayName = "@Updater";

    constructor(props) {
        super(props);

        this.state = {
            checking: true,
            description: I18n.translate("updater.init_app"),
            descriptionPrefix: "",
            progress: true,
            version: DeviceInfo.getVersion()
        };
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            this.state.loading !== nextState.loading
            || this.state.description !== nextState.description
            || this.state.descriptionPrefix !== nextState.descriptionPrefix
            || this.state.progress !== nextState.progress
            || this.state.checking !== nextState.checking
        );
    }

    render() {

        if( this.state.progress ) {

            return this._renderDownload();
        }

        return (
            <Application version={ this.state.version } />
        );
    }

    // render giao diện download
    _renderDownload = () => {

        const {
            progress: {
                receivedBytes = 0,
                totalBytes = 0
            } = {},
            descriptionPrefix,
            description
        } = this.state;

        var progress = 0;
        if (totalBytes != 0) {

            progress = receivedBytes / totalBytes;
        }

        return (
            <Downloader
                descriptionPrefix = {descriptionPrefix}
                description       = {progress > 0 ? `${receivedBytes}/${totalBytes}`: description}
                progress          = {progress}
                indeterminate     = {progress <= 0}
                onShow            = {this._onShowDownload}
                onHide            = {this._onHideDownload}
            />
        );
    };

    componentDidMount() {

        InteractionManager.runAfterInteractions(() => setTimeout(async () => {

            // nếu là android thì ẩn splash screen
            if ( Platform.OS === 'android' ) {

                const SplashScreen = require('react-native-smart-splash-screen').default;
                SplashScreen.close({
                    animationType: SplashScreen.animationType.none,
                    duration: 500,
                    delay: 20
                });
            }

            // cấu hình ngôn ngữ
            try {
                await configureI18n(I18nCache);
            } catch (error) { }

            // kiểm tra cập nhật
            if( !__DEV__ ) {

                try {
                    
                    // code push
                    await this.syncImmediate();
                } catch (e) {}
            }

            // khởi tạo ứng dụng
            if (Application.init) {

                const waitingApp = Application.init();
                if (waitingApp.then) {

                    try {
                        await waitingApp;
                    } catch (e) { }
                }
            }

            // kiểm tra phiên bản
            if (!__DEV__) {

                try {
                    
                    // phiên bản trên code push
                    await this.getUpdateMetadata();
                } catch (e) { }
            }
            

            // đóng loader
            if (__DEV__) {

                setTimeout(() => {
                    
                    this.setState({
                        progress: false
                    });
                }, 0);
            }
        }, 0));
    }

    componentWillUnmount() {

        // cho phép code push khởi động lại app
        CodePush.allowRestart();
    }

    _onShowDownload = () => {

        // không cho phép code push khởi động lại app
        CodePush.disallowRestart();
    };

    _onHideDownload = () => {

        // cho phép code push khởi động lại app
        CodePush.allowRestart();
    };

    /**
     * @todo hàm xoá cache
     */
    _clearCache = async () => {

        // xoá cache
        try {

            await CacheManager.clearAll();
            this.setState({
                checking: true,
                descriptionPrefix: "",
                description: I18n.translate("updater.clear_cache")
            });
        } catch (error) { }

        // xoá local store
        try {

            const localStoreAllKeys = await AsyncStorage.getAllKeys();
            localStoreAllKeys = localStoreAllKeys || [];

            // không xoá token
            const syncKeyAuth = require("~/configs/user").syncKey;
            if (localStoreAllKeys.length) {
                localStoreAllKeys = localStoreAllKeys.filter(key => key !== syncKeyAuth);

                await AsyncStorage.multiRemove(localStoreAllKeys);
            }

        } catch (error) { }
    };

    /**
     * @todo hàm xử lý trạng thái code push 
     * @author Croco
     */   
    codePushStatusDidChange = async (syncStatus) => {

        switch (syncStatus) {

            // đang kiểm tra phiên bản
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ 
                    checking: true,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.checking_for_update")
                });
                break;

            // đang download
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ 
                    checking: true,
                    descriptionPrefix: I18n.translate("updater.downloading_prefix"),
                    description: I18n.translate("updater.connecting")
                });
                break;
            
            // đang chờ người dùng xác nhận
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({ 
                    checking: true,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.awaiting_user_action")
                });
                break;
            
            // đang cài đặt
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ 
                    checking: true,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.installing_update")
                });

                break;
            
            // đã cài đặt phiên bản mới nhất
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({ 
                    checking: false,
                    progress: false,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.up_to_date")
                });
                break;
            
            // người dùng bỏ qua cập nhật
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({ 
                    checking: false,
                    progress: false,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.update_cancelled_by_user")
                });
                break;
            
            // đã cài đặt
            case CodePush.SyncStatus.UPDATE_INSTALLED:

                this.setState({ 
                    checking: true,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.update_installed")
                });

                // xoá cache
                try {
                    
                    await this._clearCache();
                } catch (error) {}

                // down load ngôn ngữ
                try {
                    
                    await this.downloadTranslations();
                } catch (error) {}

                setTimeout(() => {
                    
                    this.setState({
                        checking: false,
                        progress: false,
                        descriptionPrefix: "",
                        description: ""
                    });
                }, 0);

                break;
            
            // lỗi
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({ 
                    checking: false,
                    progress: false,
                    descriptionPrefix: "",
                    description: I18n.translate("updater.unknown_error") 
                });
                break;
        }
    };

    // hàm xử lý progress download
    downloadProgress = (progress, name) => {
        
        let description = this.state.description;

        if (name && typeof progress === "object") {
            
            const {
                receivedBytes = 0,
                totalBytes = 0
            } = progress;
    
            if (totalBytes != 0 && receivedBytes >= 1 ) {
                
                description = I18n.translate('updater.downloading', {
                    package: name
                });
            }
        }
        this.setState({ 
            progress,
            description
        });
    };

    // An update is available but it is not targeting the binary version of your app.
    handleBinaryVersionMismatchCallback = (update) => {

    };

    /**
     * @todo hàm kiểm tra phiên bản code push
     */
    getUpdateMetadata = async () => {

        try {

            // lấy phiên bản hiện tại đang chạy
            const metadata = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING);
            if (metadata) {
                this.setState({
                    version: `${metadata.appVersion}`
                });

                // nếu là mới cài đặt
                if (metadata.isFirstRun) {

                    // kiểm tra cập nhật lỗi
                    if (metadata.failedInstall) {

                        Alert.alert(I18n.translate("updater.update_failed"));
                    } else {

                        Alert.alert(I18n.translate("updater.update_successfully"));
                    }
                }
            }
        } catch(e) {}

        if( !this.state.checking ) {

            this.setState({
                progress: false,
                descriptionPrefix: "",
                description: ""
            });
        }
    };

    /** Update pops a confirmation dialog, and then immediately reboots the app */
    syncImmediate = () => {

        return CodePush.sync(
            { 
                deploymentKey: null,
                installMode: CodePush.InstallMode.IMMEDIATE, 
                mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
                ignoreFailedUpdates: true,
                minimumBackgroundDuration: 2,
                updateDialog: {
                    title: I18n.translate("updater.update_available"),
                    optionalUpdateMessage: I18n.translate("updater.optional_update_message"),
                    mandatoryUpdateMessage: I18n.translate("updater.mandatory_update_message"),
                    optionalInstallButtonLabel: I18n.translate("updater.optional_install_buttonLabel"),
                    optionalIgnoreButtonLabel: I18n.translate("updater.optional_ignore_button_label"),
                    mandatoryContinueButtonLabel: I18n.translate("updater.mandatory_continue_button_label"),
                    appendReleaseDescription: false,
                    descriptionPrefix: I18n.translate("updater.description_prefix")
                }
            },
            this.codePushStatusDidChange,
            this.downloadProgress,
            this.handleBinaryVersionMismatchCallback
        );
    };

    /**
     * @todo hàm tải file ngôn ngữ từ server
     */
    downloadTranslations = () => {

        return new Promise( async ( resolve, reject ) => {

            // lấy cấu hình ngôn ngữ được hỗ trợ
            const locales = require('~/configs/i18n').locales;
            
            for (let locale in locales) {
                if (locales.hasOwnProperty(locale)) {

                    try {
                        // download
                        await I18n.loadTranslation(locale, (progress) => {
                            
                            this.downloadProgress(progress, I18n.translate('locales.language'));
                        });
                    } catch (error) {}
                }
            }
            setTimeout(() => {
                
                resolve();
            }, 0);
        } );
    };
}

const _styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

export default CodePush({ 
    checkFrequency: CodePush.CheckFrequency.MANUAL
})( Updater );