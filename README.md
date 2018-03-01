# Hot fix

- trước khi build fix package background-geolocation như diff sau
> node_module/react-native-mauron85-background-geolocation/lib/build.gradle
>    - compile 'com.android.support:support-v4:+'
>    + compile 'com.android.support:support-v4:23+'

- fix lỗi: The android gradle plugin version 2.4.0-alpha7 is too old
>setx ANDROID_DAILY_OVERRIDE "5d92e8a6174110ebf133ad9f4de70d7599111e80"

- fix lỗi permision denied trên ios:
>chmod a+x ios/Fabric/Fabric.framework/uploadDSYM
>chmod a+x ios/Fabric/Fabric.framework/run
>chmod a+x ios/Fabric/Crashlytics.framework/uploadDSYM

# Account

- account code push: 
> sử dụng oauth2 github
> user: peter@itvina.com, 
> pass: itvina@123
- account google:
> user: app@itvina.com
> pass: 123@itvina

> SHA1: D8:6E:1D:FF:A8:EE:27:A3:D2:42:FD:2C:AE:09:6E:FB:AA:48:A3:C6

# Key
    ## Code push: 
        ### ITVINADriver-R-Android
            - Production: hm8C9ZT9PHasQO1myUQO1yGv00w9072f8768-e0cc-487e-971f-ee119720706b
            - Staging: oFhnF1k3WyCIY0Eca9B-hDUeLVIj072f8768-e0cc-487e-971f-ee119720706b

# Các lệnh cơ bản

>code-push release-react ITVINADriver-R-Android android --deploymentName Production --description "what is news" --mandatory --targetBinaryVersion "*"

# Link Hướng dẫn package

- hướng dẫn google service
https://developers.google.com/maps/documentation/android-api/signup#release-cert
https://developers.google.com/android/guides/google-services-plugin
https://console.developers.google.com/apis/credentials?project=itvinadriver-1515634906135&authuser=1&organizationId=310891965625

- các service của google
https://developers.google.com/android/guides/setup

# Ghi chú
- Kết quả đăng nhập bằng số đt trả về từ server
> [
> 'OK' => 'Đăng nhập thành công chưa verify',
> 'UNAUTHENTICATED' => 'SĐT chưa có trong hệ thống',
> 'AUTHENTICATED' => 'Đã đăng nhập trước đó',
> 'ERROR' => 'Lỗi',
> ];
