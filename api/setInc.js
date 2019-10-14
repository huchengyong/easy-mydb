const query = require('./query')

/**
 * @note 更新
 * @param field 要更新的字段
 * @param value 要更新的数据
 * @returns {Promise<*>}
 */
module.exports = async (mysql, field, value) => {
    const wheres = mysql.getWheres()
    if (wheres === '') {
        throw 'Lack of renewal conditions'
    }
    value = value || 1
    let sql = '`' + field + '` = `' + field + '` + ' + value
    mysql.sql = 'UPDATE `' + mysql.tableName + '` SET ' + sql + wheres
    return query(mysql, mysql.sql)
}