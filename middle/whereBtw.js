/**
 * @note whereBetween条件
 * @param field 字段名 必填
 * @param condition between条件 选填
 * @returns {db}
 */
module.exports = (mysql, field, condition) => {
    if (condition != undefined) {
        if (typeof condition === 'object') {
            let where = '`' + field + '` BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\'';
            mysql.wheres += mysql.wheres == '' ? where : ' AND ' + where;
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k];
                mysql.whereBtw(k, v);
            }
        }
    }
}