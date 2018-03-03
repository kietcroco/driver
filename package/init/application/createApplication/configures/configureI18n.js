import DeviceInfo from 'react-native-device-info';
import { AsyncStorage } from 'react-native';
import Downloader from '../../../library/Downloader';

export default ( configs = {} ) => {

	const I18n = app("I18n");
	
	I18n.defaultLocale = configs.defaultLocale;
	I18n.fallbacks = configs.fallbacks;
	I18n.translations = configs.translations || {};
	I18n.locale = I18n.defaultLocale;

	const translations = I18n.translations;


	// hàm lấy ngôn ngữ hiện tại
	const getCurrentLocale = async () => {

	    // set lại ngôn ngữ
	    var currentLocale = I18n.locale || I18n.defaultLocale;
	    try {

	    	// lấy ngôn ngữ do người dùng cấu hình
	        currentLocale = await AsyncStorage.getItem(configs.syncKey);
	        currentLocale = currentLocale || DeviceInfo.getDeviceLocale();
	    } catch (e) {}

	    if( configs.hardwareChange ) {

	    	try {

		    	// lấy ngôn ngữ dưới máy đã lưu
		    	const hardwareLocale = await AsyncStorage.getItem(configs.hardwareSyncKey);
		    	if( DeviceInfo.getDeviceLocale() !== hardwareLocale ) {

		    		AsyncStorage.setItem(configs.hardwareSyncKey, DeviceInfo.getDeviceLocale());

		    		if(hardwareLocale && hardwareLocale != "null" && hardwareLocale != "undefined") {

		    			currentLocale = DeviceInfo.getDeviceLocale();
		    		}
		    	}
		    } catch(e) {}
	    }
	    
	    currentLocale = I18n.lookupWithoutFallback(currentLocale, configs.locales || configs.translations) || defaultLocale;
	    return currentLocale;
	};

	// khởi tạo downloader
	const downloader = new Downloader(configs.downloaderConfigs, configs.Cache);

	// hàm download ngôn ngữ từ server về
    I18n.loadTranslation = async (locale, downloadCallback) => {

        downloadCallback = downloadCallback || configs.downloadCallback;

        // kiểm tra support
        locale = I18n.lookupWithoutFallback(locale, configs.locales || configs.translations) || I18n.defaultLocale;

        // lấy đường dẫn download
        const urlDownload = locales[locale];
        if (!urlDownload) {
            return {};
        }

        var data = {};

        try {

            // kiểm tra cache
            const hasCache = await downloader.cache.has(urlDownload);

            if (!hasCache) {

                // download
                const res = await downloader.download(urlDownload, {
                    progress: (progress) => {
                        downloadCallback && downloadCallback(locale, progress);
                    }
                });
            }

            // lấy dữ liệu từ cache
            data = await downloader.cache.get(urlDownload);

        } catch (e) {}

        // parse
        if (typeof data !== "object") {

            try {
                data = JSON.parse(data);
            } catch (e) {}
        }

        return data;
    };
	
	return async (downloadCallback) => {

		// sự kiện thay đổi ngôn ngữ
	    const onChangeLocale = async (locale, _downloadCallback) => {

	        if ( I18n.loadTranslation ) {

	            try {
	                
	                // download
	                const data = await I18n.loadTranslation(locale, _downloadCallback);

	                // clear các dữ liệu ngôn ngữ khác
	                I18n.translations = translations;

	                // set lại dữ liệu ngôn ngữ hiện tại
	                var translation = I18n.getTranslation(locale) || {};
				    data = data || {};

				    I18n.setTranslation(locale, {
				        ...translation,
				        ...data
				    });

	            } catch (error) {}
	        }
	    };
	    
	    // init
	    try {

	        // init ngôn ngữ hiện tại
	        I18n.locale = await getCurrentLocale();
	        await onChangeLocale(I18n.locale);

	    } catch (error) {}

	    // sự kiện thay đổi ngôn ngữ
	    I18n.configLocale = async (locale) => {

	        try {
	            
	            await onChangeLocale(locale, downloadCallback);
	            await AsyncStorage.setItem(configs.syncKey, locale);
	        } catch (error) {}
	    };

	    // sự kiện thay đổi ngôn ngữ mặc định
		I18n.configDefaultLocale = onChangeLocale;

	    return I18n.locale;
	};
};