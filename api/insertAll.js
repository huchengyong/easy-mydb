const setColumns = require('../lib/setColumns')
const R = require('ramda')
module.exports = async (_instance, maps) => {
    let [ data, limit ] = maps
    let result = null
    if (_instance.allowField == true) {
        await setColumns(_instance)
    }

    const total = data.length
    const pages = limit ? Math.ceil(total / (limit || 1)) : 1

    for (let page = 0; page < pages; page++) {
        let start = page * limit
        let newData = limit ? R.slice(start)(parseInt(start) + parseInt(limit))(data) : data
        if (typeof newData === 'object') {
            for (let k in newData[0]) {
                if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue

                _instance.options.insertFields.push(k)
            }
            for (let key in newData) {
                let val = newData[key]
                if (typeof val === 'object') {
                    _instance.options.insertValues.push(R.props(_instance.options.insertFields)(val))
                }
            }

            _instance.options.insertValues = R.map(v => `'${R.join('\',\'')(v)}'`)(_instance.options.insertValues)
        }
        _instance.sql = 'INSERT INTO' 
        + ' `' + _instance.schemaName + '` (`' 
        + R.join('`,`')(_instance.options.insertFields) 
        + '`) VALUE (' 
        + R.join('),(')(_instance.options.insertValues) + ')'
        result = await _instance.query(_instance.sql)
    }
    return result
}