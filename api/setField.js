module.exports = async (_instance, maps) => {
	const [ field, value ] = maps
    const wheres = _instance.getWheres()
    if (wheres === '') {
        throw 'Lack of renewal conditions'
    }
    value = value || ''
    let sql = '`' + field + '` = \'' + value + '\''
    _instance.options.sql = 'UPDATE `' + _instance.schemaName + '` SET ' + sql + wheres
    return _instance.query(_instance.options.sql)
}