const R = require('ramda')
function whereBtw(_instance, field, condition, conjunction) {
    let conj = conjunction || ' AND '
    if (condition) {
        if (typeof condition === 'string') condition = R.split(',')(condition)
        field = R.replace(/\./g)('`.`')(field)
        let where = ' `' + R.replace(/\B`|`\B/g)('')(field) + '` BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\' '
        _instance.options.wheres += _instance.options.wheres ? conj + where : where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereBtw(_instance, k, v, conj)
            }
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, condition, conjunction ] = maps
    whereBtw(_instance, field, condition, conjunction)
}