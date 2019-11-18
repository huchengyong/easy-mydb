const R = require('ramda')
module.exports = async (_instance, maps) => {
    const [ sql ] = maps
    _instance.sql = sql ? sql : ''
    if (_instance.schemaName === '')
        throw 'Undefined schemaName. Please use table() or model() method first'

    //initialize options
    _instance.options = {
        wheres: '',
        orders: '',
        groups: '',
        updateExp: '',
        insertFields: '',
        insertValues: ''
    }
    //fetch sql
    if (_instance.isSql === true) {
        return _instance.sql
    } else {
        return new Promise((resolve, reject) => {
            _instance.connection.then((connection) => {
                connection.query(_instance.sql, (error, results, fields) => {
                    if (error) reject(error)
                    resolve(eval('(' + JSON.stringify(results) + ')'))
                })
            })
        })
    }
}