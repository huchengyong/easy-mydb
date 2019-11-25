const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps

    let fd = (field && field !== '*') ? '`' + R.replace(/\./g)('`.`')(field) + '`' : '*'
    fd = _instance.options.groups ? fd : "COUNT(" + fd + ") AS db_count"
    _instance.sql = 'SELECT ' + fd + _instance.getSelectSql()
    if (_instance.options.groups) {
        _instance.sql = 'SELECT COUNT(' + fd + ') as db_count FROM (' + _instance.sql + ')e'
    }
    return _instance.query(_instance.sql).then((data) => {
        return data && data.length ? data[0].db_count : 0
    })
}