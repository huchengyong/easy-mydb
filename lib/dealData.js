/**
 * @note 处理update的参数数据
 * @param data
 */
const inColumns = require('./inColumns')

module.exports = (mysql) => {
    if (typeof data === 'object') {
        for (let k in data) {
            let v = data[k];
            if (typeof v === 'object') {
                this.dealData(v);
            } else {
                if (inColumns(k)) {
                    let field = '`' + k + '`';
                    let value = '\'' + v + '\'';
                    mysql.insertFields += mysql.insertFields == '' ? field : (',' + field);
                    mysql.insertValues += mysql.insertValues == '' ? value : (',' + value);
                }
            }
        }
    }
}