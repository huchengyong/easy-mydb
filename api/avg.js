const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps
    if (!field) throw 'Error: one parameter expected, none given'
    	
    _instance.sql = 'SELECT AVG(`' + R.replace(/\./g)('`.`')(field) + '`) AS res '
    + _instance.getSelectSql()
    return _instance.query(_instance.sql).then((data) => {
        return data && data.length ? data[0].res : 0
    })
}