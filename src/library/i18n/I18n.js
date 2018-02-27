import I18n from 'i18n-js';
import EventEmitter from '~/library/Events';

var currentLocale = "en";
var defaultLocale = "en";

Object.defineProperty(I18n, 'locale', {
    // Using shorthand method names (ES2015 feature).
    get() {
        return currentLocale;
    },
    set(locale) {

        if (currentLocale !== locale) {

            currentLocale = locale;
            ( async () => {

                if (I18n.configLocale) {

                    const event = I18n.configLocale(currentLocale);
                    if (event.then) {
                        try {
                            
                            await event;
                        } catch (error) {}
                    }
                    EventEmitter.emit("i18n.change.current-locale", currentLocale);
                }
            } )();
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(I18n, 'defaultLocale', {
    // Using shorthand method names (ES2015 feature).
    get() {
        return defaultLocale;
    },
    set(locale) {
        if (defaultLocale !== locale) {

            defaultLocale = locale;
            (async () => {

                if (I18n.configDefaultLocale) {

                    const event = I18n.configDefaultLocale(defaultLocale);
                    if (event.then) {
                        try {

                            await event;
                        } catch (error) { }
                    }
                    EventEmitter.emit("i18n.change.default-locale", defaultLocale);
                }
            })();

        }
    },
    enumerable: true,
    configurable: true
});

// var translations = I18n.translations || {};
// const generateTranslationsProxy = (translations = {}) => {

//     return new Proxy(translations, {
//         set(target, name, value) {

//             EventEmitter.emit("i18n.change.translation", name);
//             return target[name] = value;
//         },
//         get(target, name) {
//             return target[name];
//         }
//     });
// };
// delete I18n.translations;
// I18n.translations = generateTranslationsProxy(translations);

// Object.defineProperty(I18n, 'translations', {
//     // Using shorthand method names (ES2015 feature).
//     get() {
//         return translations;
//     },
//     set(translations = {}) {
        
//         delete I18n.translations;
//         I18n.translations = generateTranslationsProxy(I18n.translations);
//     },
//     enumerable: true,
//     configurable: true
// });

// hàm check fallback locale có được hỗ trợ hay không
I18n.lookupWithoutFallback = (locale, supportTranslations = {}) => {
    var locales = I18n.locales.get(locale);
    var supports = Object.keys(supportTranslations) || [];

    for (let key in locales) {
        if (supports.includes(locales[key])) {

            return locales[key];
        } else {
            locale = locale.replace("_", "-").toLowerCase();
            if (supports.includes(locale)) {
                
                return locale;
            }
        }
    }
    return false;
};

// hàm load dữ liệu translate
I18n.loadTranslation = (locale) => {
    
    I18n.translations[locale] = {};
};

I18n.onChangeLocale = (handle) => {

    return EventEmitter.addListener('i18n.change.current-locale', handle);
};

I18n.onChangeDefaultLocale = (handle) => {

    return EventEmitter.addListener('i18n.change.default-locale', handle);
};

export default I18n;