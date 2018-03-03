import I18n from 'i18n-js';
import EventEmitter from '../Events/EmitEvent';

var currentLocale = "en";
var defaultLocale = "en";
var translations = I18n.translations || {};

/**
 * @todo observe locale
 * @author Croco
 */
Object.defineProperty(I18n, 'locale', {
    // Using shorthand method names (ES2015 feature).
    get() {
        return currentLocale;
    },
    set(locale) {

        if (currentLocale !== locale) {

            // async dispatch event
            ( async () => {

                // nếu có set hàm config
                if (I18n.configLocale) {
                    
                    // config
                    const waiting = I18n.configLocale(locale);
                    if (waiting.then) {
                        try {
                            
                            await waiting;
                        } catch (error) {}
                    }
                }

                // trigger
                EventEmitter.emit("i18n.change.current-locale", locale);
            } )();

            currentLocale = locale;
        }
    },
    enumerable: true,
    configurable: true
});

/**
 * @todo observe defaultLocale
 * @author Croco
 */
Object.defineProperty(I18n, 'defaultLocale', {
    // Using shorthand method names (ES2015 feature).
    get() {
        return defaultLocale;
    },
    set(locale) {

        if (defaultLocale !== locale) {

            // async dispatch event
            (async () => {

                // nếu có set hàm config
                if (I18n.configLocale) {

                    // config
                    const waiting = I18n.configLocale(locale);
                    if (waiting.then) {
                        try {

                            await waiting;
                        } catch (error) { }
                    }
                }

                // trigger
                EventEmitter.emit("i18n.change.default-locale", locale);
            })();

            defaultLocale = locale;
        }
    },
    enumerable: true,
    configurable: true
});

// /**
//  * @todo hàm khởi tạo observe translations
//  * @author Croco
//  */
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
// I18n.translations = generateTranslationsProxy(translations);

// /**
//  * @todo observe translations
//  * @author Croco
//  */
// Object.defineProperty(I18n, 'translations', {
//     // Using shorthand method names (ES2015 feature).
//     get() {
//         return translations;
//     },
//     set(_translations = {}) {
        
//         translations = _translations;
//         I18n.translations = generateTranslationsProxy(translations);

//         EventEmitter.emit("i18n.change.translation");
//         return I18n.translations;
//     },
//     enumerable: true,
//     configurable: true
// });

// hàm check fallback locale có được hỗ trợ hay không
I18n.lookupWithoutFallback = (locale, supportTranslations = {}) => {

    var locales = I18n.locales.get(locale);
    var supports = Array.isArray(supportTranslations) ? supportTranslations : Object.keys(supportTranslations);

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
I18n.setTranslation = (locale, data) => {

    I18n.translations[locale] = data;
    EventEmitter.emit("i18n.change.translation", locale);
};

I18n.getTranslation = (locale) => {

    return I18n.translations[locale];
};


// hàm load dữ liệu translate
I18n.loadTranslation = (locale) => {
    
    I18n.setTranslation( locale, {} );
};

// hàm add sự kiện thay đổi ngôn ngữ hiện tại
I18n.onChangeLocale = (handle) => {

    return EventEmitter.addListener('i18n.change.current-locale', handle);
};

// hàm add sự kiện thay đổi ngôn ngữ mặc định
I18n.onChangeDefaultLocale = (handle) => {

    return EventEmitter.addListener('i18n.change.default-locale', handle);
};

export default I18n;