const R = require('ramda')
const dealObject = require('../lib/dealObject')
module.exports = (_instance, maps) => {
    const [ field, op, condition, conjunction ] = maps
    let conj = conjunction || 'AND'
    if (op && condition) {
        switch (R.toUpper(op)) {
            case 'IN':
                _instance.whereIn(field, condition, conj)
                break;
            case 'NOTIN':
                _instance.whereNotIn(field, condition, conj)
                break;
            case 'BETWEEN':
                _instance.whereBtw(field, condition, conj)
                break;
            case 'NOTBETWEEN':
                _instance.whereNotBtw(field, condition, conj)
                break;
            case 'LIKE':
                _instance.whereLike(field, condition, conj)
                break;
            case 'NOTLIKE':
                _instance.whereNotLike(field, condition, conj)
                break;
            default :
                let fd = R.replace('.')('`.`')(field)
                let wheres = '`' + R.replace(/`+$/)('')(R.replace(/^`+/)('')(fd)) + '` ' + op + ' \'' + condition + '\''
                _instance.options.wheres += _instance.options.wheres ? ' ' + conj + ' ' + wheres : wheres
                break;
        }
    } else if (op) {
        if (typeof op === 'object') {
            let obj = {};
            obj[field] = op
            dealObject(_instance, obj, conj);
        } else {
            let fd = R.replace('.')('`.`')(field)
            let wheres = '`' + R.replace(/`+$/)('')(R.replace(/^`+/)('')(fd)) + '` = \'' + op + '\''
            _instance.options.wheres += _instance.options.wheres ? ' ' + conj + ' ' + wheres : wheres
        }
    } else {
        switch (typeof field) {
            case 'object':
                dealObject(_instance, field, conj);
                break;
            case 'string':
                _instance.options.wheres += _instance.options.wheres ? ' ' + conj + ' ' + field : field
                break;
            default:
                _instance.options.wheres += ''
                break;
        }
    }
}