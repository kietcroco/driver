"use strict";

import { Linking } from 'react-native';

/**
* @todo: Hàm chuyển open url
* @author: croco
* @since: 20-1-2017
* @param string url
*/
const launchURL =  url => {

	return Linking.canOpenURL(url).then(supported => {
		if(!supported) {
			console.log('Can\'t handle url: ' + url);
		} else {
			Linking.openURL(url)
			.catch(err => {
				if(url.includes('telprompt')) {
					// telprompt was cancelled and Linking openURL method sees this as an error
					// it is not a true error so ignore it to prevent apps crashing
					// see https://github.com/anarchicknight/react-native-communications/issues/39
				} else {
					console.warn('openURL error', err)
				}
			});
		}
	}).catch(err => console.warn('An unexpected error happened', err));
};

export default launchURL;