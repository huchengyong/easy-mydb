const R = require('ramda')
function whereNotIn (_instance, field, condition, conjunction) {
    let conj = conjunction || ' AND '
    if (condition) {
        if (typeof condition === 'object') {
            condition = R.join('\',\'')(condition)
        } else if (typeof condition === 'string') {
            condition = R.replace(/,/g)('\',\'')(condition)
        }
        field = R.replace(/\./g)('`.`')(field)
        let where = ' `' + R.replace(/`+$/)('')(R.replace(/^`+/)('')(field)) + '` NOT IN (\'' + condition + '\') '
        _instance.options.wheres += _instance.options.wheres ? conj + where : where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereNotIn(_instance, k, v, conj)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition, conjunction, type ] = maps
    whereNotIn(_instance, field, condition, conjunction)
}