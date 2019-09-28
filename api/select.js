const query = require('./query');

module.exports = (mysql) => {
    mysql.sql = 'SELECT ' + (mysql.distincts != '' ? mysql.distincts : mysql.fields)
        + ' FROM `' + mysql.tableName + '` '
        + mysql.getWheres() + ' ' + mysql.groups + ' '
        + mysql.getOrders() + mysql.getLimits()
    return query(mysql, mysql.sql)
}