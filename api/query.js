const R = require('ramda')
module.exports = async (_instance, maps) => {
    const [ sql ] = maps
    _instance.sql = sql ? sql : ''
    if (_instance.schemaName === '')
        throw 'Undefined schemaName. Please use table() or model() method first'

    //fetch sql
    _instance.options = {}
    if (_instance.isSql === true) {
        _instance.isSql = null
        return _instance.sql
    } else {
        return new Promise((resolve, reject) => {
            _instance.connection.then((connection) => {
                connection.query(_instance.sql, (error, results, fields) => {
                    connection.release()
                    if (error) reject(error)
                    if (!R.isEmpty(fields) && !R.isEmpty(_instance.columns)) {
                        R.forEachObjIndexed((val, key) => {
                            if (!_instance.columns) _instance.columns = []
                            _instance.columns[key] = val.name
                        })(fields)
                    }
                    resolve(eval('(' + JSON.stringify(results) + ')'))
                })
            })
        })
    }
}