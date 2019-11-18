const setColumns = require('../lib/setColumns')
const R = require('ramda')
module.exports = async (_instance, maps) => {
    const [ data ] = maps
    if (_instance.allowField == true) {
        await setColumns(_instance)
    }

    if (typeof data === 'object') {
        for (let k in data) {
            if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue

            let field = '`' + k + '`'
            _instance.options.insertFields += _instance.options.insertFields ? ',' + field : field
            let v = data[k];
            if (typeof v === 'string' || typeof v === 'number') {
                let value = '\'' + v + '\''
                _instance.options.insertValues += _instance.options.insertValues ? ',' + value : value
            }
        }
    }
    _instance.sql = 'INSERT INTO' + ' `' + _instance.schemaName + '` (' + _instance.options.insertFields + ') VALUE (' + _instance.options.insertValues + ')'
    return _instance.query(_instance.sql)
}