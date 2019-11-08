function deal(mysql, field, value) {
    if (field != undefined && value != undefined) {
        var patt = new RegExp(/^[A-Za-z0-9]+\((.*)\)$/)
        if (patt.test(value)) {
            value = value.replace('(','(\'').replace(')','\')')
            var updateExp = '`' + field + '`' + ' = ' + value
        } else {
            var updateExp = '`' + field + '`' + ' = \'' + value + '\''
        }

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
            deal(mysql, field, '')
        }
    }
}

module.exports = (mysql, field, value) => {
    deal(mysql, field, value)
}