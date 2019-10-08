const lib = require('../lib')
const query = require('./query')

/**
 * @note 更新
 * @param data 要更新的数据
 * @returns {Promise<*>}
 */
module.exports = async (mysql, data) => {
    let wheres = mysql.getWheres();
    await lib.setColumns(mysql);
    lib.dealData(mysql, data);
    let sql = lib.setUpdate(mysql);
    mysql.sql = 'UPDATE `' + mysql.tableName + '` SET ' + sql + wheres;
    return query(mysql, mysql.sql);
}