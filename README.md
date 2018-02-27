------------ Account ----------------------------------------------------------------------
account code push: 
    sử dụng oauth2 github
    user: peter@itvina.com, 
    pass: itvina@123
account google:
    user: app@itvina.com
    pass: 123@itvina

- hướng dẫn google service
https://developers.google.com/maps/documentation/android-api/signup#release-cert
https://developers.google.com/android/guides/google-services-plugin
https://console.developers.google.com/apis/credentials?project=itvinadriver-1515634906135&authuser=1&organizationId=310891965625

- các service của google
https://developers.google.com/android/guides/setup
------------ Account ----------------------------------------------------------------------

------------ CODE PUSH --------------------------------------------------------------------

Successfully added the "ITVINADriver-R-Android" app, along with the following default deployments:
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ hm8C9ZT9PHasQO1myUQO1yGv00w9072f8768-e0cc-487e-971f-ee119720706b │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ oFhnF1k3WyCIY0Eca9B-hDUeLVIj072f8768-e0cc-487e-971f-ee119720706b │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push release-react ITVINADriver-R-Android android --deploymentName Production --description "what is news" --mandatory --targetBinaryVersion "*"

------------ CODE PUSH --------------------------------------------------------------------

------------ KEY --------------------------------------------------------------------------
 - Google api key: AIzaSyDoWRlVFpw7cFsZhg7_K_NX9fi4OjfHE_Y (android)
                    AIzaSyB5GEeql24RDahszbpEmSDcjBnmHUO8UPU
------------ KEY --------------------------------------------------------------------------

------------ BUILD ------------------------------------------------------------------------
- node_module/react-native-mauron85-background-geolocation/lib/build.gradle
    - compile 'com.android.support:support-v4:+'
    + compile 'com.android.support:support-v4:23+'

- fix lỗi:  The android gradle plugin version 2.4.0-alpha7 is too old
    setx ANDROID_DAILY_OVERRIDE "5d92e8a6174110ebf133ad9f4de70d7599111e80"
------------ BUILD ------------------------------------------------------------------------

------------ HELP -------------------------------------------------------------------------
[
    'OK' => 'Đăng nhập thành công chưa verify',
    'UNAUTHENTICATED' => 'SĐT chưa có trong hệ thống',
    'AUTHENTICATED' => 'Đã đăng nhập trước đó',
    'ERROR' => 'Lỗi',
];

------------ HELP -------------------------------------------------------------------------



chmod a+x Fabric.framework/uploadDSYM
chmod a+x Fabric.framework/run
chmod a+x Crashlytics.framework/uploadDSYM