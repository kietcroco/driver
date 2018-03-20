import WaitingEvent from '~/library/WaitingEvent';
import OneSignal from 'react-native-onesignal';
import { Linking, Platform } from 'react-native';
import { ONESIGNAL_PLAYER_ID, AUTHORIZATION, NOTIFICATION_TOKEN, UNREAD_NOTIFICATION_NUMBER } from '~/constants/registryKey';
import trackerService from '~/services/notification/tracker';
import subscriberService from '~/services/notification/subscriber';

export default (Registry) => {

    if( Platform.OS === "android" ) {

        // chuông (Android only)
        OneSignal.enableSound(true);

        // rung (Android only)
        OneSignal.enableVibrate(true);
    }
    
    // khi app đang mở: 0: none, 1: inapp alert, 2: notification
    OneSignal.inFocusDisplaying(0);

    // cho phép nhận
    OneSignal.setSubscription(true);

    // sự đăng ký lên onesignal
    const registeredHandle = e => WaitingEvent.dispatch('OneSignal.registered', e);
    // OneSignal.removeEventListener('registered', registeredHandle);
    // OneSignal.addEventListener('registered', registeredHandle);

    // sự lấy id onesignal
    const idsHandle = e => {
        WaitingEvent.dispatch('OneSignal.ids', e);
        Registry.set(ONESIGNAL_PLAYER_ID, e.userId);
    };
    OneSignal.removeEventListener('ids', idsHandle);
    OneSignal.addEventListener('ids', idsHandle);

    // sự lấy nhận thông báo
    const receivedHandle = async e => {

        WaitingEvent.dispatch('OneSignal.received', e);

        if (
            e &&
            e.payload &&
            e.payload.notificationID
        ) {

            try {
                // set lại số thông báo chưa đọc
                Registry.set(UNREAD_NOTIFICATION_NUMBER, (Registry.get(UNREAD_NOTIFICATION_NUMBER) * 1 || 0) + 1);
                // gọi lên server notification để xác nhận đã nhận được thông báo
                await trackerService.received(e.payload.notificationID);
            } catch (e) { }
        }
    };
    OneSignal.removeEventListener('received', receivedHandle);
    OneSignal.addEventListener('received', receivedHandle);

    // sự lấy open
    const openedHandle = async e => {

        WaitingEvent.dispatch('OneSignal.opened', e);
        if (
            e &&
            e.notification &&
            e.notification.payload &&
            e.notification.payload.notificationID
        ) {

            try {

                // set lại số thông báo chưa đọc
                const unreadNotification = (Registry.get(UNREAD_NOTIFICATION_NUMBER) * 1 || 0) - 1;
                Registry.set(UNREAD_NOTIFICATION_NUMBER, unreadNotification >= 0 ? unreadNotification : 0);
                // gọi lên server notification để xác nhận đã mở thông báo
                await trackerService.opened(e.notification.payload.notificationID);

            } catch (e) {}
        }
    };
    OneSignal.removeEventListener('opened', openedHandle);
    OneSignal.addEventListener('opened', openedHandle);

    // sự kiện linking
    const linkingHandle = e => WaitingEvent.dispatch('Linking.url', e && e.url || "");
    Linking.removeEventListener('url', linkingHandle);
    Linking.addEventListener('url', linkingHandle);

    return {
        remove: () => {
            Linking.removeEventListener('url', linkingHandle);
            OneSignal.removeEventListener('opened', openedHandle);
            OneSignal.removeEventListener('received', receivedHandle);
            OneSignal.removeEventListener('ids', idsHandle);
            // OneSignal.removeEventListener('registered', registeredHandle);
        }
    };
};