const query = require('./query')

module.exports = (mysql, field) => {
    let wheres = mysql.getWheres();
    mysql.sql = 'SELECT AVG(' + field + ') AS res FROM ' + '`' + mysql.tableName + '`' + wheres
    return query(mysql, mysql.sql).then((data) => {
        return data.length ? data[0].res : 0
    })
}