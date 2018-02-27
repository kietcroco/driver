import { AppRegistry, YellowBox } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

if( __DEV__ ) {


    // const YellowBox = require('react-native').YellowBox;
    // console.log(YellowBox.ignoreWarnings);
    //YellowBox.ignoreWarnings(require("./ignoredYellowBox"));
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