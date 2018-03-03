import RNFS from 'react-native-fs';
import md5 from 'crypto-js/md5';

const DEFAULT_CONFIGS = {
    keepExt: true,
    hashFileName: true,
    baseDir: RNFS.CachesDirectoryPath
        || RNFS.TemporaryDirectoryPath
        || RNFS.DocumentDirectoryPath
        || RNFS.MainBundlePath
        || RNFS.LibraryDirectoryPath
        || RNFS.ExternalStorageDirectoryPath
        || RNFS.ExternalDirectoryPath
};

class FileCache {

    constructor( namespace = "tmp", configs = {} ) {

        this.namespace = namespace;
        
        this.configs = {
            ...DEFAULT_CONFIGS,
            ...configs
        };

        this.queue = [];
        this._checkAndCreateDir(`${this.configs.baseDir}/${namespace}`);
    }

    has = (key, ext = null) => {
        ext = ext || "";
        key = this._hashKey(key);

        return new Promise( (resolve, reject) => {

            const handle = async () => {

                try {
                    let path = `${this.path}/${key}${ext}`;
                    const exists = await RNFS.exists(path);
                    if (exists) {
                        return resolve(path);
                    }

                    resolve(false);
                } catch (error) {
                    
                    reject(error);
                }
            };

            if( !this.path ) {

                return this.queue.push(handle);
            }
            handle();
        } );
    };

    get = (key, ext = null, encoding = null) => {

        // giữ param encoding luôn nằm cuối
        if (ext && !encoding){

            encoding = ext;
            ext = "";
        }

        encoding = encoding || "utf8";
        ext = ext || "";
        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {
                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}/${key}${ext}`;
                    }

                    if (encoding == "path") {

                        const exists = await RNFS.exists(key);
                        if (exists) {
                            return resolve(key);
                        }
                        return reject(new Error("File not found"));
                    }

                    const file = await RNFS.readFile(key, encoding);

                    resolve(file);
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

    all = (encoding = "utf8") => {

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    const exists = await RNFS.exists(this.path);
                    if (!exists) {

                        return resolve([]);
                    }

                    let allPath = await RNFS.readDir(this.path);
                    allPath = allPath || [];
                    if (encoding === "path") {

                        allPath = allPath.map( f => {

                            if (f && f.isFile && f.isFile()) {

                                return Promise.resolve(f.path);
                            }

                            return Promise.reject(new Error("file not found"));
                        } );
                    } else {

                        allPath = allPath.map(async f => {

                            return new Promise(async (res, rej) => {

                                if (f && f.isFile && f.isFile()) {
    
                                    try {
                                        
                                        const content = await RNFS.readFile(f.path, encoding);
                                        return res(content);
                                    } catch (e) {
                                        
                                        return rej(e);
                                    }
                                }
                                return rej(new Error("file not found"));
                            });
                        });
                    }
  
                    resolve(allPath);
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
    getPath = (key, ext = null) => {

        ext = ext || "";
        
        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {
                    key = this._hashKey(key);
                    let path = `${this.path}/${key}${ext}`;
                    let exists = await RNFS.exists(path);
                    if (exists) {
                        return resolve(path);
                    }
                    reject(new Error("file not found"));
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

    put = (key, data = "", ext = null, encoding = null) => {

        if (ext && !encoding) {

            encoding = ext;
            ext = "";
        }

        encoding = encoding || "base64";
        ext = ext || "";

        // key = this._hashKey(key);

        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {
                    
                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}/${key}${ext}`;
                    }
                    await RNFS.writeFile(key, data, encoding);

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

    delete = (key, ext = null) => {

        ext = ext || "";
        // key = this._hashKey(key);
        
        return new Promise((resolve, reject) => {

            const handle = async () => {

                try {

                    if (!`${key}`.includes(this.path)) {

                        key = this._hashKey(key);
                        key = `${this.path}/${key}${ext}`;
                    }

                    await RNFS.unlink(key);
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
                    let path = `${this.path}`;
                    await RNFS.unlink(path);
                    resolve(path);
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

    _checkAndCreateDir = async (path) => {

        try {
            
            const exists = await RNFS.exists(path);
            if (!exists) {
                
                await RNFS.mkdir(path, MkdirOptions);
            }
            this.path = path;
            this.queue.forEach(task => task());
            this.queue = [];
        } catch (error) {
            this.queue = [];
            throw error;
        }
    };

    /**
     * @todo tạo tên file
     */
    _hashKey = (key) => {

        key = `${key || (new Date).getTime()}`;

        let isParams = key.includes("?");
        let isDir = key.includes("/");
        let fileName = key;
        
        let ext = !fileName.includes(".") ? "" : fileName.substring(fileName.lastIndexOf("."), isParams ? fileName.indexOf("?") : undefined);

        if (isParams || isDir || this.configs.hashFileName) {

            fileName = md5(fileName);
            fileName = `${fileName}`;
            if( this.configs.keepExt ) {

                fileName = `${fileName}${ext}`;
            }
        }
        return fileName;
    };
}

const MkdirOptions = {
    NSURLIsExcludedFromBackupKey: false
};

export default FileCache;