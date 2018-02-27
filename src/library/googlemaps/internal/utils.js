export var deprecate = (handle, message) => {

    return (...args) => {
        console.warn(message);
        handle(...args);
    };
};