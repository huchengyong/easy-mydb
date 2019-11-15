const R = require('ramda')
const isKeyWord = require('./isKeyWord')
const strToExp = require('./strToExp')
function dealObject (_instance, condition, exp, pKey) {
    for (let key in condition) {
        let val = condition[key]

        if (typeof val === 'object') {
            switch (R.toUpper(key)) {
                case 'IN':
                    _instance.whereIn(pKey, val, exp)
                    break
                case 'BETWEEN':
                    _instance.whereBtw(pKey, val, exp)
                    break
                case 'LIKE':
                    _instance.whereLike(pKey, val, exp)
                    break
                default:
                    break
            }
            if (['IN', 'BETWEEN', 'LIKE'].indexOf(R.toUpper(key)) !== -1) break
            dealObject(_instance, val, exp, key)
        } else {
            if (isKeyWord(key)) {
                let s = strToExp(key);
                pKey = R.replace('.')('`.`')(pKey)
                let sqlPiece = '`' + R.replace(/\B`|`\B/g)('')(pKey) + '` ' + s + ' \'' + val + '\' '
                _instance.options.wheres += !R.isEmpty(_instance.options.wheres) ? ' ' + (exp || '') + ' ' + sqlPiece : sqlPiece
            } else if (key.toUpperCase() === 'IN') {
                _instance.whereIn(pKey, val, exp)
            } else if (key.toUpperCase() === 'BETWEEN') {
                _instance.whereBtw(pKey, val, exp)
            } else if (key.toUpperCase() === 'LIKE') {
                _instance.whereLike(pKey, val, exp)
            } else {
                key = R.replace('.')('`.`')(key)
                let sqlPiece = "`" + R.replace(/\B`|`\B/g)('')(key) + "` = \'" + val + '\' '
                _instance.options.wheres += !R.isEmpty(_instance.options.wheres) ? ' ' + (exp || '') + ' ' + sqlPiece : sqlPiece
            }
        }
    }
}

module.exports = (...maps) => {
    const [ _instance, condition, conjunction ] = maps
    dealObject(_instance, condition, conjunction)
}