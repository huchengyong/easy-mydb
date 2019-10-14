function deal(mysql, field, value) {
    if (field != undefined && value != undefined) {
        const fieldStr = '`' + field + '`'
        const valueStr = '`' + field + '` - ' + value
        const updateExp = fieldStr + ' = ' + valueStr
        mysql.updateExp += mysql.updateExp == '' ? updateExp : (',' + updateExp)
    } else if (field != undefined) {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                if (typeof v === 'object') {
                    deal(mysql, v)
                } else {
                    deal(mysql, k, v)
                }
            }
        } else {
            deal(mysql, field, 1)
        }
    }
}

module.exports = (mysql, field, value) => {
    deal(mysql, field, value)
}