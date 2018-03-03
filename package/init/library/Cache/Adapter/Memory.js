import md5 from 'crypto-js/md5';

const DEFAULT_CONFIGS = {

};

const Cache = {};

class MemoryCache {

    constructor(namespace = "tmp", configs = {}) {

        this.namespace = namespace;
        this.configs = {
            ...DEFAULT_CONFIGS,
            ...configs
        };

        this.queue = [];
        this._checkAndCreateNamespace(`${namespace}`);
    }

    has = (key) => {
        key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = () => {

                try {

                    if (Cache[this.path] && Cache[this.path][key] !== undefined) {

                        return resolve(`${this.path}:${key}`);
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

            const handle = () => {

                try {

                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                    } else {
                        key = `${key}`.replace(`${this.path}:`, "");
                    }

                    if (typeof Cache[this.path] === "object") {

                        return resolve(Cache[this.path][key]);
                    }

                    resolve(undefined);
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

                    let allKeys = [];
                    if (typeof Cache[this.path] === "object") {
                        
                        for (let key in Cache[this.path]) {
                            if (Cache[this.path].hasOwnProperty(key)) {
                                
                                allKeys.push(Promise.resolve(Cache[this.path][key]));
                            }
                        }
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

    put = (key, data = undefined) => {

        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = () => {

                try {

                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                    } else {
                        key = `${key}`.replace(`${this.path}:`, "");
                    }

                    if (typeof Cache[this.path] !== "object") {

                        Cache[this.path] = {};
                    }

                    Cache[this.path][key] = data;

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

            const handle = () => {

                try {
                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                    } else {
                        key = `${key}`.replace(`${this.path}:`, "");
                    }

                    if (typeof Cache[this.path] === "object") {

                        delete Cache[this.path][key];
                    }

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

            const handle = () => {

                try {

                    delete Cache[this.path];
                    resolve(this.path);
                } catch (error) {
                    reject(error);
                }
            };

            if (!this.path) {

                this.queue.push(handle);
                return;
            }
            handle();
        });
    };

    _checkAndCreateNamespace = async (namespace) => {

        try {

            if ( typeof Cache[namespace] !== "object") {

                Cache[namespace] = {};
            }

            this.path = namespace;
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

export default MemoryCache;