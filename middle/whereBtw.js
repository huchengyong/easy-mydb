const R = require('ramda')
function whereBtw(_instance, field, condition) {
    if (condition) {
        if (typeof condition === 'string') condition = R.split(',')(condition)
        field = R.replace('.')('`.`')(field)
        let where = '`' + field + '` BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\''
        _instance.options.wheres += !_instance.options.wheres ? ' AND ' + where : where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereBtw(k, v)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition ] = maps
    whereBtw(_instance, field, condition)
}