/**
 * @note 去重
 * @param field
 * @returns {db}
 */
module.exports = (mysql, field) => {
    if (typeof field === 'string' && field != '') {
        let distinct = field.split(',');

        distinct = distinct.join('`,`');
        distinct = distinct == '' ? '' : ('`' + distinct + '`');

        mysql.distincts = ' DISTINCT ' + distinct;
    }
}