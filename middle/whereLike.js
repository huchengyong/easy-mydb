const R = require('ramda')
function whereLike (_instance, field, condition, conjunction) {
    let conj = conjunction || ' AND '
    if (condition) {
        if (typeof condition === 'string') {
            field = R.replace(/\./g)('`.`')(field)
            let where = ' `' + R.replace(/`+$/)('')(R.replace(/^`+/)('')(field)) + '` LIKE \'' + condition + '\' '
            _instance.options.wheres += _instance.options.wheres ? conj + where : where
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereLike(_instance, k, v, conj)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition, conjunction ] = maps
    whereLike(_instance, field, condition, conjunction)
}