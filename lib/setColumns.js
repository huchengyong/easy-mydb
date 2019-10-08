/**
 * @note 设置表中的所有字段
 * @returns {Promise<Array>}
 */
const query = require('../api/query')
module.exports = async (mysql) => {
    let sql = 'DESC `' + mysql.tableName + '`';
    let result = await query(mysql, sql);

    let columns = [];
    let i = 0;
    for (let k in result) {
        columns[i] = result[k].Field;
        i++;
    }
    mysql.columns = columns;
}