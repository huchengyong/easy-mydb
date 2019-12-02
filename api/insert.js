const setColumns = require('../lib/setColumns')
const dealData = require('../lib/dealData')
const R = require('ramda')
module.exports = async (_instance, maps) => {
    const [ data ] = maps
    if (!data) throw 'Error: one parameter expected, none given'

    if (_instance.allowField == true) {
        let insertFields = _instance.options.insertFields
        let insertValues = _instance.options.insertValues
        await setColumns(_instance)
        _instance.options.insertFields = insertFields
        _instance.options.insertValues = insertValues
    }

    dealData(_instance, data)
    
    _instance.sql = 'INSERT INTO'
    + ' `' + _instance.schemaName
    + '` ('
    + R.join(',')(_instance.options.insertFields)
    + ') VALUE ('
    + R.join(',')(_instance.options.insertValues)
    + ')'

    return _instance.isSql === true ? _instance.sql : _instance.query(_instance.sql)
}