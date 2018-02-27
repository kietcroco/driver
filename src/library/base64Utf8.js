export const encode = (str) => btoa(unescape(encodeURIComponent(str)));
export const decode = (str) => decodeURIComponent(escape(atob(str))); 