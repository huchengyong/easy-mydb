const lib = require('../lib')
const R = require('ramda')
module.exports = async (_instance, maps) => {
    let [ data, limit ] = maps
    let result = null
    if (_instance.allowField == true) {
        await lib.setColumns(_instance)
    }

    const total = data.length
    const pages = limit ? Math.ceil(total / (limit || 1)) : 1

    for (let page = 0; page < pages; page++) {
        let start = page * limit
        let newData = limit ? R.slice(start)(parseInt(start) + parseInt(limit))(data) : data
        if (typeof newData === 'object') {
            for (let k in newData[0]) {
                if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue

                _instance.options.insertFields += _instance.options.insertFields ? (',`' + k + '`') : ('(' + '`' + k + '`')
            }
            _instance.options.insertFields += ')'
            for (let key in newData) {
                let val = newData[key]
                if (typeof val === 'object') {
                    _instance.options.insertValues += _instance.options.insertValues ? ',(' : '('
                    for (let k in val) {
                        if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue

                        let v = val[k];
                        _instance.options.insertValues += '\'' + v + '\',';
                    }
                    let stop = R.lastIndexOf(',')(_instance.options.insertValues) - 1
                    let f = R.slice(0)(stop)(_instance.options.insertValues) + '\''
                    _instance.options.insertValues = f + ')';
                }
            }
        }
        _instance.sql = 'INSERT INTO' + ' `' + _instance.schemaName + '` ' + _instance.options.insertFields + ' VALUE ' + _instance.options.insertValues + ''
        result = await _instance.query(_instance.sql)
    }
    return result
}