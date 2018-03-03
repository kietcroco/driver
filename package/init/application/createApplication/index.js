import React from 'react';
import { InteractionManager, Platform } from 'react-native';
import Alias from '../../library/Alias';
import EventEmitter from '../../library/Events/EmitEvent';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import CodePush from "react-native-code-push";

import CacheManagerClass from '../../library/Cache/CacheManager';

import repairConfig from './utils/repairConfig';
import I18n from '../../library/i18n/I18n';
import configureI18n from './configures/configureI18n';
import I18nContext from '../../library/i18n/I18nContext';

const configCaptureException = (configs) => {

	exceptionHandler = require('react-native-exception-handler');

	exceptionHandler.setJSExceptionHandler((error, isFatal) => {

    	error.isFatal = isFatal;
    	EventEmitter.emit('application.JSException', error);
    	EventEmitter.emit('application.exception', error);
    }, true);

    exceptionHandler.setNativeExceptionHandler((exceptionString) => {

    	const error = new Error(`${exceptionString}`);
    	error.isFatal = true;
    	
    	EventEmitter.emit('application.NativeException', error);
    	EventEmitter.emit('application.exception', error);
    }, false);
};

const createCacheManager = (configs = {}) => {

	if( configs.CacheManager ) {

		configs.CacheManager.setConfigs(configs);
		return configs.CacheManager;
	}

	return new CacheManagerClass(configs);
};

export default ( ComponentProvider, configs = {} ) => {

	if( typeof ComponentProvider !== "function" ) {

		throw new Error("componentProvider is not a function");
	}

	if( typeof configs !== "object" ) {

		throw new Error("configs is not a object");
	}

	configs = repairConfig(configs);

	configs.application.captureException 
		&& configCaptureException(configs.application.captureException);

	const CacheManager = createCacheManager(configs.caches);

	Alias.register( configs.alias.CACHE_MANAGER, CacheManager );
	Alias.register( configs.alias.EVENT_EMITTER, EventEmitter );
	Alias.register( "I18n", I18n );

	const appReload = () => {

		throw new Error("application is not running");
	};

	const app = {
		restart: () => {

			const CodePush = require("react-native-code-push");
			const restartApp = CodePush.restartApp || CodePush.default.restartApp;
			restartApp && restartApp();
		},
		reload: appReload,
		addListener: EventEmitter.addListener.bind(EventEmitter),
		emit: EventEmitter.emit.bind(EventEmitter),
		configs
	};

	Alias.register( "app", (instance) => {

		if(instance) {

			return Alias.get( instance );
		}
		return app;
	} );

	ComponentProvider = ComponentProvider();

	app.emit("application.registered", configs);
	
	return () => {

		const SplashScreen = configs.splashScreen.component || require('../../components/SplashScreen').default;
		app.emit("application.loaded", configs);

		class Application extends React.Component {

			constructor(props) {
				super(props);

				this.state = {
					loaded: false,
					booted: false,
					reloading: false,
					downloading: false,
					status: "",
					progress: false,
					codePushVersion: 0
				};

				// không cho phép code push khởi động lại app
        		CodePush.disallowRestart();

				app.emit("application.bootstrapping", props);
			}

			render() {

				if( !this.state.booted ) {

					return (
						<SplashScreen />
					);
				}

				if( this.state.reloading ) {

					return null;
				}

				return (
					<I18nContext>
						<ComponentProvider
							booted = {this.state.loaded}
							codePushVersion = {this.state.codePushVersion}
							download = { {
								progress: this.state.downloading && this.state.progress,
								status: this.state.status,
								package: this.state.downloading
							} }
						/>
					</I18nContext>
				);
			}
			componentDidMount() {

				app.reload = () => {

					this.setState({
						reloading: true
					}, () => {

						this.setState({
							reloading: false
						});
					});
				};
				
				InteractionManager.runAfterInteractions(() => setTimeout(async () => {

					// nếu là android thì ẩn splash screen
		            if ( Platform.OS === 'android' ) {

		                const SplashScreen = require('react-native-smart-splash-screen').default;
		                SplashScreen.close({
		                    animationType: SplashScreen.animationType.none,
		                    duration: 500,
		                    delay: 20,
		                    ...configs.splashScreen
		                });
		            }

					app.emit("application.bootstrapped", this.props);

					try {

						await configureI18n({
							...configs.i18n,
							Cache: CacheManager.resolve("i18n")
						})( (locale, progress) => {

							this.setState({
								downloading: 'LOCALE',
								package: locale,
								progress
							});
						} );

						if( this.state.downloading === "LOCALE" ) {

							this.setState({
								downloading: false,
								package: "",
								progress: false
							});
						}
					} catch(e) {}

					
		            this.setState({
		            	booted: true
		            });

		            app.emit("application.startup", this.props);
		        }, 0));
			}
			componentWillUnmount() {

				// cho phép code push khởi động lại app
        		CodePush.allowRestart();

				app.reload = appReload;
				app.emit("application.shutdown", this.props);
			}

			/**
		     * @todo hàm xử lý trạng thái code push 
		     * @author Croco
		     */   
		    _codePushStatusDidChange = async (syncStatus) => {

		        switch (syncStatus) {

		            // đang kiểm tra phiên bản
		            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
		                this.setState({ 
		                	downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.CHECKING_FOR_UPDATE,
		                    package: "new version"
		                });
		                break;

		            // đang download
		            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
		            	this.setState({ 
		            		downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.DOWNLOADING_PACKAGE,
		                    package: "new version"
		                });
		                break;
		            
		            // đang chờ người dùng xác nhận
		            case CodePush.SyncStatus.AWAITING_USER_ACTION:
		                this.setState({ 
		                	downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.AWAITING_USER_ACTION,
		                    package: "new version"
		                });
		                break;
		            
		            // đang cài đặt
		            case CodePush.SyncStatus.INSTALLING_UPDATE:
		                this.setState({ 
		                    downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.INSTALLING_UPDATE,
		                    package: "new version"
		                });

		                break;
		            
		            // đã cài đặt phiên bản mới nhất
		            case CodePush.SyncStatus.UP_TO_DATE:
		                this.setState({ 
		                    downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.UP_TO_DATE,
		                    package: "new version"
		                }, () => {

		                	if( this.state.downloading === "CODEPUSH" ) {

		                		this.setState({
		                			downloading: false,
				                    status: "",
				                    package: ""
		                		});
		                	}
		                });
		                break;
		            
		            // người dùng bỏ qua cập nhật
		            case CodePush.SyncStatus.UPDATE_IGNORED:

		            	this.setState({ 
		                    downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.UPDATE_IGNORED,
		                    package: "new version"
		                }, () => {

		                	if( this.state.downloading === "CODEPUSH" ) {

		                		this.setState({
		                			downloading: false,
				                    status: "",
				                    package: ""
		                		});
		                	}
		                });
		                break;
		            
		            // đã cài đặt
		            case CodePush.SyncStatus.UPDATE_INSTALLED:

		                this.setState({ 
		                    downloading: "CODEPUSH",
		                    status: CodePush.SyncStatus.UPDATE_INSTALLED,
		                    package: "new version"
		                });

		                // // xoá cache
		                // try {
		                    
		                //     await this._clearCache();
		                // } catch (error) {}

		                // // down load ngôn ngữ
		                // try {
		                    
		                //     await this.downloadTranslations();
		                // } catch (error) {}

		                // setTimeout(() => {
		                    
		                //     this.setState({
		                //         checking: false,
		                //         progress: false,
		                //         descriptionPrefix: "",
		                //         description: ""
		                //     });
		                // }, 0);

		                break;
		            
		            // lỗi
		            case CodePush.SyncStatus.UNKNOWN_ERROR:

		            	if( this.state.downloading === "CODEPUSH" ) {

	                		this.setState({
	                			downloading: false,
			                    status: "",
			                    package: ""
	                		});
	                	}
		                break;
		        }
		    };

		    // hàm xử lý progress download
		    _downloadProgress = (progress) => {

		        if (typeof progress === "object") {
		            
		            const {
		                receivedBytes = 0,
		                totalBytes = 0
		            } = progress || {};
		    
		            if ( totalBytes == 0 ) {

		            	return this.setState({ 
		            		downloading: "CODEPUSH",
		                    package: "new version",
				            progress: false
				        });
		            }
		        }
		        this.setState({ 
		            progress,
		            downloading: "CODEPUSH",
                    package: "new version"
		        });
		    };

			/** Update pops a confirmation dialog, and then immediately reboots the app */
		    _syncImmediate = () => {

		        return CodePush.sync(
		            { 
		                ...configs.codePush,
		                updateDialog: configs.codePush.updateDialog()
		            },
		            this._codePushStatusDidChange,
		            this._downloadProgress,
		            this._handleBinaryVersionMismatchCallback
		        );
		    };

		    /**
		     * @todo hàm kiểm tra phiên bản code push
		     */
		    _getUpdateMetadata = async () => {

		        try {

		            // lấy phiên bản hiện tại đang chạy
		            const metadata = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING);
		            if (metadata) {
		                this.setState({
		                    codePushVersion: `${metadata.appVersion}`
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
		    };

		    // An update is available but it is not targeting the binary version of your app.
		    _handleBinaryVersionMismatchCallback = (update) => {

		    };
		}
		return CodePush({
			...configs.codePush,
			checkFrequency: CodePush.CheckFrequency.MANUAL
		})(Application);
	};
};