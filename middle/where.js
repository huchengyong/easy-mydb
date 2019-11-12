const dealObject = require('../lib/dealObject')
module.exports = (_instance, maps) => {
    const [ field, op, condition, conjunction ] = maps
    if (op != undefined && condition != undefined) {
        switch (op.toUpperCase()) {
            case 'IN':
                if (typeof condition === 'object') {
                    _instance.whereIn(field, condition)
                } else if (typeof condition === 'string') {
                    let cn = condition.split(',');
                    _instance.whereIn(field, cn)
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
                //如果字段不存在.字符
                let fd = field.split('.').join('`.`')
                let wheres = '`' + fd + '` ' + op + ' \'' + condition + '\''
                _instance.options.wheres += !_instance.options.wheres ? ' ' + conjunction + ' ' + wheres : wheres
                break;
        }
    } else if (op != undefined) {
        //如果字段不存在.字符
        let fd = field.split('.').join('`.`')
        let wheres = '`' + fd + '` = \'' + op + '\''
        _instance.options.wheres += !_instance.options.wheres ? ' ' + conjunction + ' ' + wheres : wheres
    } else {
        switch (typeof field) {
            case 'object':
                dealObject(_instance, field, conjunction);
                break;
            case 'string':
                _instance.options.wheres += !_instance.options.wheres ? ' ' + conjunction + ' ' + field : field
                break;
            default:
                _instance.options.wheres += ''
                break;
        }
    }
}