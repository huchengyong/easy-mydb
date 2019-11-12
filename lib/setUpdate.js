const R = require('ramda')
module.exports = maps => {
    const [ _instance ] = maps
    let fields = R.filter(v => v)(R.split(',')(_instance.options.insertFields))
    let values = R.filter(v => v)(R.split(',')(_instance.options.insertValues))

    let sql = '';
    for (let i = 0; i < fields.length; i++) {
        let str = fields[i] + ' = ' + values[i];
        sql += sql == '' ? str : (',' + str);
    }

    sql += sql == '' ? _instance.options.updateExp : (_instance.options.updateExp == '' ? '' : ',' + _instance.options.updateExp)
    return sql;
}