/**
 * @note 联表查询
 * @param table 关联的表
 * @param op 表达式
 * @param method 关联方式 默认 INNER, LEFT/RIGHT/FULL
 * @returns {db}
 */
module.exports = (mysql, table, op, method) => {
    let m = method ? method.toUpperCase() : 'INNER'
    mysql.joinStr = ` ${m} JOIN ${table} ON ${op} `
}