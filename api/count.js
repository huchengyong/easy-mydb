const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps

    field = (field && field !== '*') ? '`' + R.replace('.')('`.`')(field) + '`' : '*'
    field = _instance.options.groups ? field : "COUNT(" + field + ") AS db_count"
    _instance.options.sql = 'SELECT ' + field
    + _instance.getSelectSql()
    if (_instance.options.groups) {
        _instance.options.sql = 'SELECT COUNT(' + field + ') as db_count FROM (' + _instance.options.sql + ')e'
    }
    return _instance.query(_instance.options.sql).then((data) => {
        return data && data.length ? data[0].db_count : 0
    })
}