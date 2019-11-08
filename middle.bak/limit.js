/**
 * @note 偏移
 * @param start 开始
 * @param offset 偏移量
 */
module.exports = (mysql ,start, offset) => {
    if (offset != undefined) {
        mysql.limits = start + ',' + offset;
    } else {
        mysql.limits = start;
    }
}