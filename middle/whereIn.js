/**
 *
 * @note whereIn条件
 * @param field 字段名
 * @param condition IN条件
 * @returns {db}
 */
module.exports = (mysql, field, condition) => {
    if (condition != undefined) {
        if (typeof condition === 'object') {
            condition = condition.join('\',\'');
        }
        let where = '`' + field + '` IN (\'' + condition + '\')';
        mysql.wheres += mysql.wheres == '' ? where : ' AND ' + where;
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k];
                mysql.whereIn(k, v);
            }
        }
    }
}