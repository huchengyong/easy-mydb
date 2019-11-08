const query = require('./query')

module.exports = (mysql, pk) => {
    if (pk != undefined) {
        mysql.sql = 'DELETE FROM ' + '`' + mysql.tableName + '` WHERE `' + mysql.primaryKey + '` = \'' + pk + '\''
    } else {
        let wheres = mysql.getWheres()
        if (wheres === '')
            throw 'Lack of renewal conditions'
        mysql.sql = 'DELETE FROM ' + '`' + mysql.tableName + '`' + wheres
    }
    return query(mysql, mysql.sql);
}