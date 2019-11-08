/**
 * @note 排序
 * @param field 字段名 必填
 * @param order 排序规则
 * @returns {db}
 */
module.exports = (mysql, field, order) => {
    if (order != undefined) {
        if (typeof order === 'object') {
            for (let k in order) {
                let v = order[k]
                mysql.order(k, v)
            }
        } else if (typeof order === 'string') {
            field = field.split('.').join('`.`')
            var orders = '`' + field + '`' + ' ' + order.toUpperCase()
            mysql.orders += mysql.orders == '' ? orders : ',' + orders
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                mysql.order(k, v)
            }
        } else {
            mysql.orders += mysql.orders == '' ? field : ',' + field
        }
    }
}