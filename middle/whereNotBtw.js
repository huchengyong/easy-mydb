const R = require('ramda')
function whereNotBtw(_instance, field, condition, conjunction) {
    let conj = conjunction || ' AND '
    if (condition) {
        if (typeof condition === 'string') condition = R.slice(0)(2)(R.split(',')(condition))
        field = R.replace(/\./g)('`.`')(field)
        let where = ' `' + R.replace(/\B`|`\B/g)('')(field) + '` NOT BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\' '
        _instance.options.wheres += _instance.options.wheres ? conj + where : where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereNotBtw(_instance, k, v, conj)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition, conjunction ] = maps
    whereNotBtw(_instance, field, condition, conjunction)
}