const R = require('ramda')
module.exports = async (...maps) => {
    const [ _instance ] = maps
    if (!_instance.columns || R.isEmpty(_instance.columns)) {
        let sql = 'DESC `' + _instance.schemaName + '`'
        let result = await _instance.query(sql)

        let columns = []
        let i = 0
        for (let k in result) {
            columns[i] = result[k].Field
            i++
        }
        _instance.columns = columns
    }
}