const query = require('./query')

module.exports = (mysql, pk) => {
    if (pk != undefined) {
        let id = mysql.getPrimaryKey()
        mysql.sql = 'DELETE FROM ' + '`' + mysql.tableName + '` WHERE `' + id + '` = \'' + pk + '\''
    } else {
        let wheres = mysql.getWheres()
        mysql.sql = 'DELETE FROM ' + '`' + mysql.tableName + '`' + wheres
    }
    return query(mysql, mysql.sql);
}