module.exports = async (_instance, maps) => {
	const [ field, value ] = maps
    const wheres = _instance.getWheres()
    if (wheres === '') {
        throw 'Error: Lack of renewal conditions'
    }
    let val = value || ''
    let sql = '`' + field + '` = \'' + val + '\''
    _instance.sql = 'UPDATE `' + _instance.schemaName + '` SET ' + sql + wheres
    return _instance.query(_instance.sql)
}