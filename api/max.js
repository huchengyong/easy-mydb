const R = require('ramda')
module.exports = (_instance, maps) => {
	const [ field ] = maps
	if (!field) throw 'Error: one parameter expected, none given'

    _instance.sql = 'SELECT MAX(`' + R.replace('.')('`.`')(field) + '`) AS res '
    + _instance.getSelectSql()
    return _instance.query(_instance.sql).then((data) => {
        return !data.length ? 0 : data[0].res
    })
}