export default (prevSource, nextSource) => {

    if (
        // nếu không phải object thì so sánh trùng
        ((
            typeof prevSource !== "object"
            || typeof nextSource !== "object"
        ) && prevSource !== nextSource)
        // nếu là object thì so sánh uri
        || (
            typeof prevSource === "object"
            && typeof nextSource === "object"
            && prevSource.uri !== nextSource.uri
        )
    ) {
        return true;
    }
    return false;
}