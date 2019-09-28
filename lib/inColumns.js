/**
 * @note 判断字段是否在表中存在
 * @param k 字段
 * @returns {boolean}
 */
module.exports = (k) => {
    return this.columns.indexOf(k) != -1;
}