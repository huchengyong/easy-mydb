function deal(_instance, field, value) {
    if (field && value) {
        const fieldStr = '`' + field + '`'
        const valueStr = '`' + field + '` - ' + value
        _instance.options.updateExp.push(fieldStr + ' = ' + valueStr)
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
            deal(_instance, field, 1)
        }
    }
}

module.exports = (_instance, maps) => {
    const [ field, value ] = maps
    deal(_instance, field, value)
}