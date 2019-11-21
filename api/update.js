const setColumns = require('../lib/setColumns')
const R = require('ramda')
module.exports = async (_instance, maps) => {
    const [ data ] = maps
    let wheres = _instance.getWheres()
    if (wheres === '')
        throw 'Lack of renewal conditions'

    if (_instance.allowField == true) await setColumns(_instance)

    for (let k in data) {
        let v = data[k]
        if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue
        _instance.options.updateExp.push(`\`${k}\` = '${v}'`)
    }

    _instance.sql = 'UPDATE `' + _instance.schemaName + '` SET ' + R.join(',')(_instance.options.updateExp) + wheres
    return _instance.query(_instance.sql)
}