const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps
    _instance.options.sql = 'SELECT AVG(`' + R.replace('.')('`.`')(field) + '`) AS res '
    + _instance.getSelectSql()
    return _instance.query(_instance.options.sql).then((data) => {
        return data && data.length ? data[0].res : 0
    })
}