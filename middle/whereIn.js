/**
 *
 * @note whereIn条件
 * @param field 字段名
 * @param condition IN条件
 * @returns {db}
 */
function whereIn (mysql, field, condition) {
    if (condition != undefined) {
        if (typeof condition === 'object') {
            condition = condition.join('\',\'')
        } else if (typeof condition === 'string') {
            condition = condition.split(',').join('\',\'')
        }
        field = field.split('.').join('`.`')
        let where = '`' + field + '` IN (\'' + condition + '\')'
        mysql.wheres += mysql.wheres == '' ? where : ' AND ' + where
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                whereIn(k, v)
            }
        }
    }
}

module.exports = (mysql, field, condition) => {
    whereIn(mysql, field, condition)
}