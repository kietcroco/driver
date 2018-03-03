import md5 from 'crypto-js/md5';
import { AsyncStorage } from 'react-native';

const DEFAULT_CONFIGS = {};

class LocalStoreCache {

    constructor(namespace = "tmp", configs = {}) {

        this.namespace = namespace;
        this.configs = {
            ...DEFAULT_CONFIGS,
            ...configs
        };

        this.queue = [];
        this._checkAndCreate(`${namespace}`);
    }

    has = (key) => {
        key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    let allKeys = await AsyncStorage.getAllKeys();
                    allKeys = allKeys || [];
                    let path = `${this.path}${key}`;
                    if (allKeys.length && allKeys.includes(path)) {

                        return resolve(path);
                    }

                    resolve(false);
                } catch (error) {

                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    get = (key) => {

        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}${key}`;
                    }

                    let value = await AsyncStorage.getItem(key);
                    value = value ? JSON.parse(value) : value;

                    resolve(value);
                } catch (error) {
                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    all = () => {

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    let allKeys = await AsyncStorage.getAllKeys();
                    allKeys = allKeys || [];

                    if (!allKeys || !allKeys.length) {

                        return resolve([]);
                    }

                    allKeys = allKeys.filter( key => {

                        return `${key}`.includes(this.path);
                    } );

                    allKeys = allKeys.map( key => {

                        return new Promise(async (res, rej) => {

                            try {

                                let value = await AsyncStorage.getItem(key);
                                value = value ? JSON.parse(value) : value;

                                res(value);
                            } catch (error) {

                                rej(error);
                            }
                        });
                    } );

                    resolve(allKeys);
                } catch (error) {
                    
                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    /**
     * @todo exists path
     */
    getPath = (key) => {

        key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                let path = `${this.path}${key}`;

                return resolve(path);
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    put = (key, data = undefined) => {

        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    if (data === undefined) {

                        return reject(new Error("Data not available"));
                    }
                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}${key}`;
                    }

                    data = JSON.stringify(data);
                    await AsyncStorage.setItem(key, data);

                    resolve(key);
                } catch (error) {

                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    delete = (key) => {

        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}${key}`;
                    }

                    await AsyncStorage.removeItem(key);

                    resolve(key);
                } catch (error) {

                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    }

    clear = () => {

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    let allKeys = await this._getAllKeyNamespace();
                    allKeys = allKeys || [];
                    if (allKeys.length) {

                        await AsyncStorage.multiRemove(allKeys);
                    }

                    resolve(allKeys);
                } catch (error) {
                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    _getAllKeyNamespace = () => {

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    let allKeys = await AsyncStorage.getAllKeys();
                    allKeys = allKeys || [];
                    let path = `${this.path}`;

                    allKeys = allKeys.filter( (key = "") => {

                        return key.substring(0, path.length) === path;
                    } );

                    resolve(allKeys);
                } catch (error) {

                    reject(error);
                }
            };

            if (!this.path) {

                return this.queue.push(handle);
            }
            handle();
        });
    };

    _checkAndCreate = async (path) => {

        try {
            
            this.path = `@${path}:`;
            this.queue.forEach(task => task());
            this.queue = [];
        } catch (error) {

            this.queue = [];
            throw error;
        }
    };

    /**
     * @todo tạo tên
     */
    _hashKey = (key) => {

        key = `${key || (new Date).getTime()}`;
        key = md5(key);

        return `${key}`;
    };
}

export default LocalStoreCache;