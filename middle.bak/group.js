/**
 * @note 分组
 * @param field 字段名
 * @returns {db}
 */
module.exports = (mysql, field) => {
    if (typeof field === 'string' && field != '') {
        let groups = field.split(',')

        groups = groups.join('`,`')
        groups = groups == '' ? '' : ('`' + groups + '`')
        groups = groups.split('.').join('`.`')

        mysql.groups = ' GROUP BY ' + groups
    }
}