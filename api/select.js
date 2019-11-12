module.exports = (_instance) => {
    _instance.sql = 'SELECT '
    + (_instance.options.distincts ? _instance.options.distincts : (_instance.options.fields || '*'))
    + _instance.getSelectSql()
    return _instance.query(_instance.sql)
}