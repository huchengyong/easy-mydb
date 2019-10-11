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
                //如果字段不存在.字符
                if (field.indexOf('.') == -1) {
                    var wheres = '`' + field + '` ' + op + ' \'' + condition + '\'';
                } else {
                    field = field.split('.')
                    var wheres = '`' + field[0] + '`.`' + field[1] + '` ' + op + ' \'' + condition + '\'';
                }
                mysql.wheres += mysql.wheres == '' ? wheres : (' ' + conjunction + ' ' + wheres);
                break;
        }
    } else if (op != undefined) {
        //如果字段不存在.字符
        if (field.indexOf('.') == -1) {
            var wheres = '`' + field + '` = \'' + op + '\'';
        } else {
            field = field.split('.')
            var wheres = '`' + field[0] + '`.`' + field[1] + '` = \'' + op + '\'';
        }
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