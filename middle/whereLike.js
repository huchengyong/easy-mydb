const R = require('ramda')
function whereLike (_instance, field, condition) {
    if (condition != undefined) {
        if (typeof condition === 'string') {
            field = R.replace('.')('`.`')(field)
            let where = '`' + field + '` LIKE \'' + condition + '\''
            _instance.options.wheres += !_instance.options.wheres ? ' AND ' + where : where
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereLike(k, v)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition ] = maps
    whereLike(_instance, field, condition)
}