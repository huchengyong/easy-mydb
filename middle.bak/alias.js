/**
 * @note 给当前表起别称
 * @param s 别称
 * @returns {db}
 */
module.exports = (mysql, s) => {
    mysql.aliasStr = ` AS ${s} `
}