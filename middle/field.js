/**
 * @note 声明字段
 * @param fields 字段名
 * @returns {db}
 */
module.exports = (mysql, fields) => {
    mysql.fields = fields || '*'
}