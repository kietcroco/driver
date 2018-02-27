// hàm so sánh 2 giá trị có khác nhau không
// cho phép null === "" === undefined === NaN (ngoại trừ 0)
export default (a, b) => !((a !== b) && (!!a | !!b)) && (a !== 0 && b !== 0);