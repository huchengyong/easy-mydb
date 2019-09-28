const query = require('./query')
const lib = require('../lib')

module.exports = (mysql, data) => {
    lib.setColumns(mysql);
    if (typeof data === 'object') {
        for (let k in data) {
            if (lib.inColumns(k)) {
                let field = '`' + k + '`';
                mysql.insertFields += mysql.insertFields == '' ? field : (',' + field);
                let v = data[k];
                if (typeof v === 'string' || typeof v === 'number') {
                    let value = '\'' + v + '\'';
                    mysql.insertValues += mysql.insertValues == '' ? value : (',' + value);
                }
            }
        }
    }
    mysql.sql = 'INSERT INTO' + ' `' + mysql.tableName + '` (' + mysql.insertFields + ') VALUE (' + mysql.insertValues + ')';
    return query(mysql.sql);
}