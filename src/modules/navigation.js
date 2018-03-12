/**
 * @flow
*/
import React from 'react';
import StackNavigator from '~/library/navigation/StackNavigator';
import SlideTransitioner from '~/library/navigation/components/SlideTransitioner';
import Header from '~/components/Header';
// import Footer from '~/components/Footer';

import { namespace } from './main/constants';

// các màn hình
import Main from './main';
import modals from './modals';

// đăng ký router
const routeConfiguration = {
	[namespace + '/']: { screen: Main },
	...modals
};

// config router
const navigatorConfiguration = {
	//initialRouteName: namespace + '/',

	/** Member */
	// initialRouteName: '/member/login',
	// initialRouteName: '/member/comfirm-code',
	// initialRouteName: '/member/register',

	/** Hành trình */
	initialRouteName: '/journey/report',

	initialRouteParams: {

	},
	navigationOptions: {
		header: Header,
		// footer: Footer
	},
	headerMode: "float",
	footerMode: "float",
	lazy: true
};

export default StackNavigator(routeConfiguration, navigatorConfiguration, SlideTransitioner);