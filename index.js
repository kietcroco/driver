import { AppRegistry, YellowBox, AsyncStorage } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

if( __DEV__ ) {


    // const YellowBox = require('react-native').YellowBox;
    // console.log(YellowBox.ignoreWarnings);
    //YellowBox.ignoreWarnings(require("./ignoredYellowBox"));

    const ThrottledPromise = require('~/library/ThrottledPromise').default;
    AsyncStorage.getAllKeys = ThrottledPromise(AsyncStorage.getAllKeys, 3000);
    AsyncStorage.getItem = ThrottledPromise(AsyncStorage.getItem, 3000);
    AsyncStorage.multiGet = ThrottledPromise(AsyncStorage.multiGet, 3000);
    AsyncStorage.mergeItem = ThrottledPromise(AsyncStorage.mergeItem, 3000);
    AsyncStorage.multiMerge = ThrottledPromise(AsyncStorage.multiMerge, 3000);
    AsyncStorage.removeItem = ThrottledPromise(AsyncStorage.removeItem, 3000);
    AsyncStorage.setItem = ThrottledPromise(AsyncStorage.setItem, 3000);
} else {
    // report crash error
    setJSExceptionHandler((error, isFatal) => {

        const firebase = require("react-native-firebase").default;

        if (isFatal) {
            
            firebase.crash().log("Lỗi js fatal error");
        } else {

            firebase.crash().log("Lỗi js");
        }

        firebase.crash().report(error);

        if (isFatal) {
            setTimeout(() => {

                const CodePush = require("react-native-code-push");
                const restartApp = CodePush.restartApp || CodePush.default.restartApp;
                restartApp && restartApp();
            }, 1000);
        }
    }, true);

    setNativeExceptionHandler((exceptionString) => {
        const firebase = require("react-native-firebase").default;

        const error = new Error(`${exceptionString}`);

        firebase.crash().log("Lỗi native");
        firebase.crash().report(error);

        setTimeout(() => {

            const CodePush = require("react-native-code-push");
            const restartApp = CodePush.restartApp || CodePush.default.restartApp;
            restartApp && restartApp();
        }, 1000);
    }, false);
}

require('~/library/polyfills/process');
const App = require('./src').default;

AppRegistry.registerComponent('ITVINADriver', () => App);