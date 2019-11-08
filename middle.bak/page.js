/**
 * @note 偏移
 * @param p 页码
 * @param offset 偏移量
 */
module.exports = (mysql ,p, offset) => {
    let start = (p - 1) * offset

    if (offset != undefined) {
        mysql.limits = start + ',' + offset;
    } else {
        mysql.limits = start;
    }
}