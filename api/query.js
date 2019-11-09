module.exports = async (_instance, maps) => {
    const [sql] = maps
    _instance.options.sql = sql
    if (_instance.schemaName === '')
        throw 'Undefined schemaName. Please use table() or model() method first'

    //fetch sql
    if (_instance.options.isSql === true) {
        _instance.options.isSql = null
        return _instance.options.sql
    } else {
        return new Promise((resolve, reject) => {
            _instance.connection.then((connection) => {
                connection.query(_instance.options.sql, (error, results, fields) => {
                    connection.release()
                    if (error) reject(error)
                    resolve(eval('(' + JSON.stringify(results) + ')'))
                })
            })
        })
    }
}