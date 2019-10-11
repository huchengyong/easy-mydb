const query = require('./query')

module.exports = (mysql, field) => {
    field = field.split('.').join('`.`')
    mysql.sql = 'SELECT MAX(`' + field + '`) AS res FROM ' + '`' + mysql.tableName + '`' + mysql.aliasStr
        + mysql.joinStr
        + mysql.getWheres()
    return query(mysql, mysql.sql).then((data) => {
        return data.length ? data[0].res : 0
    })
}