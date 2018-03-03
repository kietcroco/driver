import driverSupport from './Adapter';

class CacheManager {

    constructor( configs = {} ) {

        this.setConfigs(configs);
        this._resolved = {};
    }

    setConfigs = (configs) => {

        this.configs = configs || {};
    };

    resolve = ( name ) => {

        if( name ) {
            
            if ( this._resolved[name] ) {

                return this._resolved[name];
            } else {

                if (typeof this.configs[name] !== "object" || !driverSupport[this.configs[name].driver]) {

                    throw new Error("cache driver not support");
                }
                return this._resolved[name] = this.createDriver(this.configs[name].driver, this.configs[name].namespace, this.configs[name].options);
            }
        }

        return;
    };

    createDriver = (driver, namespace = "tmp", options = {}) => {

        if (!driverSupport[driver]) {

            throw new Error("cache driver not support");
        }

        return new driverSupport[driver](namespace, options);
    };

    clearAll = () => {

        return new Promise( async (res, rej) => {

            let keys = [];
            let errors = [];

            for (let name in this.configs) {
                if (this.configs.hasOwnProperty(name)) {
                    
                    try {
                        
                        let instance = this.resolve(name);
                        if (instance && instance.clear) {
    
                            await instance.clear();
                            keys.push(name);
                        }
                    } catch (error) {
                        errors.push(error.message);
                    }
                }
            }

            if (errors.length) {

                return rej(errors);
            }

            return res(keys);
        } );
    };
}

export default CacheManager;