/**
 * @note whereBetween条件
 * @param field 字段名 必填
 * @param condition between条件 选填
 * @returns {db}
 */

function whereBtw(mysql, field, condition) {
    if (condition != undefined) {
        if (typeof condition === 'object') {
            var where = '`' + field + '` BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\'';
        } else if (typeof condition === 'string') {
            condition = condition.split(',')
            var where = '`' + field + '` BETWEEN \'' + condition[0].trim() + '\' AND \'' + condition[1].trim() + '\'';
        }
        mysql.wheres += mysql.wheres == '' ? where : ' AND ' + where;
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k];
                whereBtw(k, v);
            }
        }
    }
}

module.exports = (mysql, field, condition) => {
    whereBtw(mysql, field, condition)
}