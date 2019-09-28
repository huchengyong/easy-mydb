/**
 * @note 更新字段的语句
 * @returns {string}
 */
module.exports = (mysql) => {
    let fields = mysql.insertFields.split(',');
    let values = mysql.insertValues.split(',');

    let sql = '';
    for (let i = 0; i < fields.length; i++) {
        let str = fields[i] + ' = ' + values[i];
        sql += sql == '' ? str : (',' + str);
    }
    return sql;
}