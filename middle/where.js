const R = require('ramda')
const dealObject = require('../lib/dealObject')
module.exports = (_instance, maps) => {
    const [ field, op, condition, conjunction ] = maps
    let conj = conjunction || 'AND'
    if (op && condition) {
        switch (R.toUpper(op)) {
            case 'IN':
                if (typeof condition === 'object') {
                    _instance.whereIn(field, condition, conj)
                } else if (typeof condition === 'string') {
                    let cn = condition.split(',');
                    _instance.whereIn(field, cn, conj)
                }
                break;
            case 'BETWEEN':
                if (typeof condition === 'object') {
                    _instance.whereBtw(field, condition)
                }
                break;
            case 'LIKE':
                _instance.whereLike(field, condition)
                break;
            default :
                let fd = R.replace('.')('`.`')(field)
                let wheres = '`' + R.replace(/\B`|`\B/g)('')(fd) + '` ' + op + ' \'' + condition + '\''
                _instance.options.wheres += !_instance.options.wheres ? ' ' + conj + ' ' + wheres : wheres
                break;
        }
    } else if (op) {
        let fd = R.replace('.')('`.`')(field)
        let wheres = '`' + R.replace(/\B`|`\B/g)('')(fd) + '` = \'' + op + '\''
        _instance.options.wheres += !_instance.options.wheres ? ' ' + conj + ' ' + wheres : wheres
    } else {
        switch (typeof field) {
            case 'object':
                dealObject(_instance, field, conj);
                break;
            case 'string':
                _instance.options.wheres += !_instance.options.wheres ? ' ' + conj + ' ' + field : field
                break;
            default:
                _instance.options.wheres += ''
                break;
        }
    }
}