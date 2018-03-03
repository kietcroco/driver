import RNFetchBlob from 'react-native-fetch-blob';
import MemoryCache from '~/library/Cache/Adapter/Memory';
import { lookup as mimeLookup } from 'react-native-mime-types';
import { Platform } from 'react-native';

const DEFAULT_CONFIGS = {
    fileCache: false
};
const DefaultCache = new MemoryCache("download");

class Downloader {

    constructor( configs = {}, Cache ) {

        this.configs = {
            ...DEFAULT_CONFIGS,
            ...configs
        };
        this.cache = Cache || DefaultCache;
    }

    download = (url, options = {}) => {

        const result = new Promise(async (resolve, reject) => {

            // kiểm tra cache
            try {
                const hasCache = await this.cache.has(url);

                // nếu có cache thì lấy cache
                if (hasCache) {

                    // nếu cache là file thì lấy đường dẫn file
                    if (this.cache.constructor.name == "FileCache") {

                        return resolve(`${FILE_PREFIX}${hasCache}`);
                    }

                    // lấy nội dung
                    const content = await this.cache.get(hasCache);
                    return resolve(content);
                }
            } catch (e) {}

            // cấu hình fetch blob
            var configs = {
                ...this.configs
            };
            options = options || {};

            // nếu chưa có path và cache là file thì tạo path cho file
            if (!configs.path && this.cache.constructor.name == "FileCache") {
                
                configs.path = `${this.cache.path}/${this.cache._hashKey(url)}`;
            }

            // header request
            const headers = options.headers || {};

            const progress = (receivedBytes, totalBytes) => {

                if( !options.progress ) {
                    return;
                }
                receivedBytes = receivedBytes || 0;
                receivedBytes = receivedBytes * 1;
                totalBytes = totalBytes || 0;
                totalBytes = totalBytes * 1;
                options.progress({
                    receivedBytes,
                    totalBytes
                });
            };
            const uploadProgress = (writtenBytes, totalBytes) => {

                if( !options.uploadProgress ) {
                    return;
                }
                writtenBytes = writtenBytes || 0;
                writtenBytes = writtenBytes * 1;
                totalBytes = totalBytes || 0;
                totalBytes = totalBytes * 1;
                options.uploadProgress({
                    writtenBytes,
                    totalBytes
                });
            };

            // tác vụ download
            var task = RNFetchBlob
                .config(configs)
                .fetch('GET', url, headers)
                .uploadProgress(uploadProgress)
                .progress(progress)
            ;

            // hàm huỷ down
            result.cancel = ( message ) => {

                if (task && task.cancel) {
                    task.cancel();
                    task = undefined;
                }
                reject(new Error(message));
            };

            var base64;

            try {
                // chờ down xong
                const res = await task;
                task = undefined;

                // nếu là cache file thì trả về đường dẫn
                if (this.cache.constructor.name == "FileCache" && res.path()) {

                    return resolve(`${FILE_PREFIX}${ res.path() }`);
                }
                
                // tạo loại file từ ext trong url
                var mimeType = mimeLookup(url);
                mimeType = mimeType || res.info().headers["content-type"];

                // tạo base64
                base64 = `data:${mimeType};base64,${res.base64()}`;
                resolve(base64);
            } catch (e) {

                return reject(e);
            }

            try {
                // lưu cache
                await this.cache.put(url, base64);
            } catch (e) {}
        });

        result.cancel = () => {};

        return result;
    };
}

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

export default Downloader;