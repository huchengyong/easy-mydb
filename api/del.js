module.exports = (_instance, maps) => {
	const [ pk ] = maps
    if (pk) {
        _instance.sql = 'DELETE FROM ' + '`' + _instance.schemaName + '` WHERE `' + _instance.primaryKey + '` = \'' + pk + '\''
    } else {
        let wheres = _instance.getWheres()
        if (wheres === '')
            throw 'Lack of renewal conditions'
        _instance.sql = 'DELETE FROM ' + '`' + _instance.schemaName + '`' + wheres
    }
    return _instance.query(_instance.options.sql);
}