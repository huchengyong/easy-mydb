/**
 * @note 处理where条件对象
 * @param condition 条件
 * @param exp 表达式
 * @param pKey
 */
module.exports = (mysql, condition, exp, pKey) => {
    for (let key in condition) {
        let val = condition[key];

        if (typeof val === 'object') {
            switch (key.toUpperCase()) {
                case 'IN':
                    mysql.whereIn(key, val);
                    break;
                case 'BETWEEN':
                    mysql.whereBtw(key, val);
                    break;
                default:
                    break;
            }
            mysql.dealObject(val, exp, key);
        } else {
            //是否关键字 gt lt ...等
            if (mysql.isKeyWord(key)) {
                let s = mysql.strToExp(key);
                let sqlPiece = '`' + pKey + '` ' + s + ' \'' + val + '\' ';
                mysql.wheres += mysql.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece);
            } else if (key.toUpperCase() === 'LIKE') {
                mysql.whereLike(key, val);
            } else {
                let sqlPiece = "`" + key + "` = \'" + val + '\' ';
                mysql.wheres += mysql.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece);
            }
        }
    }
}