const query = require('./query')
const lib = require('../lib')

/**
 * @note 批量插入数据
 * @param data
 * @param limit 批次
 * @returns {Promise<void>}
 */
module.exports = (mysql, data, limit) => {
    lib.setColumns(mysql);
    if (typeof data === 'object') {
        for (let k in data[0]) {
            if (lib.inColumns(k)) {
                mysql.insertFields += mysql.insertFields == '' ? ('(' + '`' + k + '`') : (',`' + k + '`');
            }
        }
        mysql.insertFields += ')';
        for (let key in data) {
            let val = data[key];
            if (typeof val === 'object') {
                mysql.insertValues += mysql.insertValues == '' ? '(' : ',(';
                for (let k in val) {
                    if (lib.inColumns(k)) {
                        let v = val[k];
                        mysql.insertValues += '\'' + v + '\',';
                    }
                }
                let f = mysql.insertValues.substr(0, mysql.insertValues.lastIndexOf(',') - 1) + '\'';
                mysql.insertValues = f + ')';
            }
        }
    }
    mysql.sql = 'INSERT INTO' + ' `' + mysql.tableName + '` ' + mysql.insertFields + ' VALUE ' + mysql.insertValues + '';
    return query(mysql.sql);
}