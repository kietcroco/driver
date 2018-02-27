import { addNavigationHelpers, NavigationActions } from 'react-navigation';

NavigationActions.REPLACE = "Navigation/REPLACE";
NavigationActions.replace = (routeName: String, params: Object = {}, replaceNum: Number = 1, action: Object) => {

    const newAction = NavigationActions.navigate({
        routeName,
        params,
        replaceNum,
        action
    });
    newAction.type = NavigationActions.REPLACE;

    return newAction;
};

export default (options: Object) => {

    const navigation = addNavigationHelpers(options);
    
    // navigation.replace = (routeName: String, params: Object = {}, replaceNum: Number = 1, action: Object) => {

    //     const newAction =  NavigationActions.navigate({
    //         routeName,
    //         params,
    //         replaceNum,
    //         action
    //     });
    //     newAction.type = "Navigation/REPLACE";

    //     navigation.dispatch(  newAction  );
    // };

    navigation.replace = (...args) => {

        const replaceAction = NavigationActions.replace(...args);
        if (typeof replaceAction == "object") {
            navigation.dispatch(replaceAction);
        }
    };

    return navigation;
};