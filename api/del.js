module.exports = (_instance, maps) => {
	const [ pk ] = maps
    if (pk) {
        if (typeof pk === 'strging') pk = `'${pk}'`
        _instance.sql = 'DELETE FROM ' + '`' + _instance.schemaName + '` WHERE `' + (_instance.primaryKey || 'id') + '` = ' + pk
    } else {
        let wheres = _instance.getWheres()
        if (wheres === '')
            throw 'Lack of renewal conditions'
        _instance.sql = 'DELETE FROM ' + '`' + _instance.schemaName + '`' + wheres
    }
    return _instance.query(_instance.sql).then((data) => {
        return !data.affectedRows ? false : true
    })
}