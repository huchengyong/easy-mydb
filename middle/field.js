/**
 * @note 声明字段
 * @param fields 字段名
 * @returns {db}
 */
module.exports = (mysql, fields) => {
    mysql.fields = fields || '*';
    if (mysql.fields !== '*') {
        let filedsArr = mysql.fields.split(',');
        let filedsStr = '';
        for (let k = 0; k < filedsArr.length; k++) {
            filedsStr += '`' + filedsArr[k] + '`,';
        }
        mysql.fields = filedsStr.substr(0, filedsStr.length - 1);
    }
}