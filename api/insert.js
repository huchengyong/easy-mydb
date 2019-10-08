const query = require('./query')
const lib = require('../lib')

module.exports = async (mysql, data) => {
    await lib.setColumns(mysql);

    if (typeof data === 'object') {
        for (let k in data) {
            if (lib.inColumns(mysql, k)) {
                let field = '`' + k + '`'
                mysql.insertFields += mysql.insertFields == '' ? field : (',' + field)
                let v = data[k];
                if (typeof v === 'string' || typeof v === 'number') {
                    let value = '\'' + v + '\''
                    mysql.insertValues += mysql.insertValues == '' ? value : (',' + value)
                }
            }
        }
    }
    mysql.sql = 'INSERT INTO' + ' `' + mysql.tableName + '` (' + mysql.insertFields + ') VALUE (' + mysql.insertValues + ')'
    return query(mysql, mysql.sql)
}