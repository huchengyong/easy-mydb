const lib = require('../lib')

module.exports = (mysql, field, op, condition, conjunction) => {
    if (op != undefined && condition != undefined) {
        switch (op.toUpperCase()) {
            case 'IN':
                if (typeof condition === 'object') {
                    mysql.whereIn(field, condition);
                } else if (typeof condition === 'string') {
                    condition = condition.split(',');
                    mysql.whereIn(field, condition);
                }
                break;
            case 'BETWEEN':
                if (typeof condition === 'object') {
                    mysql.whereBtw(field, condition);
                }
                break;
            case 'LIKE':
                mysql.whereLike(field, condition);
                break;
            default :
                let wheres = ' `' + field + '` ' + op + ' \'' + condition + '\'';
                mysql.wheres += mysql.wheres == '' ? wheres : (' ' + conjunction + ' ' + wheres);
                break;
        }
    } else if (op != undefined) {
        let wheres = ' `' + field + '` = \'' + op + '\'';
        mysql.wheres += mysql.wheres == '' ? wheres : (' ' + conjunction + ' ' + wheres);
    } else {
        switch (typeof field) {
            case 'object':
                lib.dealObject(mysql, field, conjunction);
                break;
            case 'string':
                mysql.wheres += mysql.wheres == '' ? field : (' ' + conjunction + ' ' + field);
                break;
            default:
                mysql.wheres += '';
                break;
        }
    }
}