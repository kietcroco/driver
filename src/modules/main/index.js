/**
 * @flow
*/
import React from 'react';
import { View, Text } from 'react-native';
import { namespace } from './constants';
import TabNavigator from '~/library/navigation/TabNavigator';
import SlideTransitioner from '~/library/navigation/components/SlideTransitioner';
import Footer from '~/components/Footer';
import Tabbar from '~/components/Tabbar';

// các màn hình
import Home from './containers/Home.container';
import Setting from './scenes/Setting.scene';
import Notification from './scenes/Notification.scene';
import Profile from './scenes/Profile.scene';

// đăng ký router
const routeConfiguration = {
	[ `${namespace}/home` ]: { screen: Home },
	[`${namespace}/setting`]: { screen: Setting },
	[`${namespace}/notification`]: { screen: Notification },
	[`${namespace}/profile`]: { screen: Profile },
};

// config router
const navigatorConfiguration = {
	initialRouteName: namespace + "/home",
	initialRouteParams: {
		
	},
	navigationOptions: {
		footer: Footer,
		footerContent: Tabbar
	},
	headerMode: "none",
	footerMode: "none",
	lazy: true
};

export default TabNavigator( routeConfiguration, navigatorConfiguration, SlideTransitioner );