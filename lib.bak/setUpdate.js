module.exports = (_instance) => {
    let fields = _instance.insertFields.split(',').filter(d => d);
    let values = _instance.insertValues.split(',').filter(d => d);

    let sql = '';
    for (let i = 0; i < fields.length; i++) {
        let str = fields[i] + ' = ' + values[i];
        sql += sql == '' ? str : (',' + str);
    }

    sql += sql == '' ? _instance.updateExp : (_instance.updateExp == '' ? '' : ',' + _instance.updateExp)
    return sql;
}