const setUpdate = require('../lib/setUpdate')
const dealData = require('../lib/dealData')
const setColumns = require('../lib/setColumns')
module.exports = async (_instance, maps) => {
    const [ data ] = maps
    let wheres = _instance.getWheres()
    if (wheres === '')
        throw 'Lack of renewal conditions'

    if (_instance.allowField == true) await setColumns(_instance)

    dealData(_instance, data)
    let sql = setUpdate(_instance)
    _instance.sql = 'UPDATE `' + _instance.tableName + '` SET ' + sql + wheres
    _instance.options.updateExp = ''
    return _instance.query(_instance.sql)
}