/**
 * @note whereLike条件
 * @param field 字段名 必填
 * @param condition 条件 选填
 * @returns {db}
 */
module.exports = (mysql, field, condition) => {
    if (condition != undefined) {
        if (typeof condition === 'string') {
            let where = '`' + field + '` LIKE \'' + condition + '\'';
            mysql.wheres += mysql.wheres == '' ? where : ' AND ' + where;
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k];
                mysql.whereLike(k, v);
            }
        }
    }
}