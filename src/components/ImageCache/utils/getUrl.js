const REGX_URL = /https?/;

export default (source) => {
    
    if (typeof source === "object" && REGX_URL.test(source.uri)) {

        return source.uri;
    }
};