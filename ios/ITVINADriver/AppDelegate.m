/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
@import GoogleMaps;
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import "ReactNativeExceptionHandler.h"

// https://github.com/facebook/react-native/issues/16376
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

@implementation AppDelegate

// onesignal
@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // firebase
  [FIRApp configure];

  // google map
  [GMSServices provideAPIKey:@"AIzaSyCPTvT8Il_Pyj_ak8awouh7P1UkA0QW1Mc"];

  // facebook sdk https://developers.facebook.com/docs/facebook-login/ios
  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];

  // onesignal
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                       appId:@"YOUR_ONESIGNAL_APP_ID"];

  NSURL *jsCodeLocation;

  // code push
  #ifdef DEBUG
      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
      jsCodeLocation = [CodePush bundleURL];
  #endif

  /**
   * @todo fix bug RCTBridge required dispatch_sync to load RCTDevLoadingView
   * @see https://github.com/facebook/react-native/issues/16376
  */
  RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                            moduleProvider:nil
                                             launchOptions:launchOptions];
  #if RCT_DEV
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ITVINADriver"
                                            initialProperties:nil];

  /*RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ITVINADriver"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];*/
  /**
   * @end fix bug RCTBridge required dispatch_sync to load RCTDevLoadingView
  */

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];


  /**
   * @todo: exception handler
   * @see: https://github.com/master-atul/react-native-exception-handler
  */
  [ReactNativeExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException){

    // THE CODE YOU WRITE HERE WILL REPLACE THE EXISTING NATIVE POPUP THAT COMES WITH THIS MODULE.
    //We create an alert box
    UIAlertController* alert = [UIAlertController
                                alertControllerWithTitle:@"Critical error occurred"
                                message: [NSString stringWithFormat:@"%@\n%@",
                                          @"Apologies..The app will close now \nPlease restart the app\n",
                                          readeableException]
                                preferredStyle:UIAlertControllerStyleAlert];

    // We show the alert box using the rootViewController
    [rootViewController presentViewController:alert animated:YES completion:nil];

    // THIS IS THE IMPORTANT PART
    // By default when an exception is raised we will show an alert box as per our code.
    // But since our buttons wont work because our click handlers wont work.
    // to close the app or to remove the UI lockup on exception.
    // we need to call this method
    // [ReactNativeExceptionHandler releaseExceptionHold]; // to release the lock and let the app crash.

    // Hence we set a timer of 4 secs and then call the method releaseExceptionHold to quit the app after
    // 4 secs of showing the popup
    [NSTimer scheduledTimerWithTimeInterval:4.0
                                     target:[ReactNativeExceptionHandler class]
                                   selector:@selector(releaseExceptionHold)
                                   userInfo:nil
                                    repeats:NO];

    // or  you can call
    // [ReactNativeExceptionHandler releaseExceptionHold]; when you are done to release the UI lock.
  }];
  /**
   * @end: exception handler
  */

  return YES;
}

/**
 * @todo: facebook sdk + google signin
*/
- (void)applicationDidBecomeActive:(UIApplication *)application {    
    // Call the 'activateApp' method to log an app event for use
    // in analytics and advertising reporting.
    [FBSDKAppEvents activateApp];
    // ...
}


- (BOOL)application:(UIApplication *)application 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];

  // google signin
  handled = handled || [RNGoogleSignin application:application 
    openURL:url 
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] 
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];

  // Add any custom logic here.
  return handled;
}

/**
 * @end: facebook sdk + google signin
*/


@end
