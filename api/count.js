const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps
    let fd = (field && field !== '*') ? '`' + R.replace(/\./g)('`.`')(field) + '`' : '*'

    if (_instance.options.groups) {
        _instance.sql = 'SELECT COUNT(' + fd + ') AS mydb_count FROM ('
            + `SELECT ${_instance.options.fields || '*'}`
            + _instance.getSelectSql()
            + ')' + _instance.options.aliasStr
    } else {
        _instance.sql = 'SELECT COUNT(' + fd + ') AS mydb_count '
            + _instance.getSelectSql()
    }

    return _instance.isSql === true ? _instance.sql : _instance.query(_instance.sql).then((data) => {
        return data && data.length ? data[0].mydb_count : 0
    })
}