const query = require('./query')

module.exports = (mysql, field) => {
    field = (field && field !== '*') ? '`' + field.split('.').join('`.`') + '`' : '*'
    field = mysql.groups ? field : "COUNT(" + field + ") AS db_count"
    mysql.sql = 'SELECT ' + field + ' FROM ' + '`' + mysql.tableName + '`' + mysql.aliasStr
        + mysql.joinStr
        + mysql.getWheres() + ' ' + mysql.groups + ' '
        + mysql.getOrders()
        + mysql.getLimits()
    if (mysql.groups) {
        mysql.sql = 'SELECT COUNT(' + field + ') as db_count FROM (' + mysql.sql + ')e'
    }
    return query(mysql, mysql.sql).then((data) => {
        return data.length ? data[0].db_count : 0
    })
}