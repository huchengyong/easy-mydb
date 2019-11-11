const R = require('ramda')
module.exports = (_instance) => {
    _instance.options.sql = 'SELECT ' 
    + (_instance.options.distincts ?: _instance.options.fields) 
    + _instance.getSelectSql()
    return _instance.query(_instance.options.sql)
}