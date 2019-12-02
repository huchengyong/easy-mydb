const R = require('ramda')
module.exports = (_instance, maps) => {
	const [ field ] = maps
	if (!field) throw 'Error: one parameter expected, none given'

    if (_instance.options.groups) {
        _instance.sql = 'SELECT MIN(`' + R.replace(/\./g)('`.`')(field) + '`) AS mydb_min FROM ('
            + `SELECT ${_instance.options.fields || '*'}`
            + _instance.getSelectSql()
            + ')' + _instance.options.aliasStr
    } else {
        _instance.sql = 'SELECT MIN(`' + R.replace(/\./g)('`.`')(field) + '`) AS mydb_min '
            + _instance.getSelectSql()
    }

    return _instance.isSql === true ? _instance.sql : _instance.query(_instance.sql).then((data) => {
        return !data.length ? 0 : data[0].mydb_min
    })
}