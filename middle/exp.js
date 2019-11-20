function deal(_instance, field, value) {
    if (field != undefined && value != undefined) {
        var patt = new RegExp(/^[A-Za-z0-9]+\((.*)\)$/)
        if (patt.test(value)) {
            // value = value.replace('(','(\'').replace(')','\')')
            var updateExp = '`' + field + '`' + ' = ' + value
        } else {
            if (typeof value === 'string') value = `'${value}'`
            var updateExp = '`' + field + '`' + ' = ' + value
        }

        _instance.options.updateExp.push(updateExp)
    } else if (field != undefined) {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                if (typeof v === 'object') {
                    deal(_instance, v)
                } else {
                    deal(_instance, k, v)
                }
            }
        } else {
            deal(_instance, field, '')
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, value ] = maps
    deal(_instance, field, value)
}