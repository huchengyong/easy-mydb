const R = require('ramda')
function whereIn (_instance, field, condition) {
    if (condition) {
        if (typeof condition === 'object') {
            condition = R.join('\',\'')(condition)
        } else if (typeof condition === 'string') {
            condition = R.replace(',')('\',\'')(condition)
        }
        field = R.replace('.')('`.`')(field)
        let where = '`' + field + '` IN (\'' + condition + '\')'
        _instance.options.wheres += !R.isEmpty(_instance.options.wheres) ? ' AND ' + where : where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereIn(_instance, k, v)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition ] = maps
    whereIn(_instance, field, condition)
}