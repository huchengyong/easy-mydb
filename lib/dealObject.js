/**
 * @note 处理where条件对象
 * @param condition 条件
 * @param exp 表达式
 * @param pKey
 */

const isKeyWord = require('./isKeyWord')
const strToExp = require('./strToExp')

function dealObject (mysql, condition, exp, pKey) {
    for (let key in condition) {
        let val = condition[key]

        if (typeof val === 'object') {
            switch (key.toUpperCase()) {
                case 'IN':
                    mysql.whereIn(pKey, val)
                    break
                case 'BETWEEN':
                    mysql.whereBtw(pKey, val)
                    break
                case 'LIKE':
                    mysql.whereLike(pKey, val)
                    break
                default:
                    break
            }
            if (['IN', 'BETWEEN'].indexOf(key.toUpperCase()) !== -1) break
            dealObject(mysql, val, exp, key)
        } else {
            //是否关键字 gt lt ...等
            if (isKeyWord(key)) {
                let s = strToExp(key);
                //如果字段不存在.字符
                var sqlPiece = '`' + pKey + '` ' + s + ' \'' + val + '\' '
                if (pKey.indexOf('.') == -1) {
                    var sqlPiece = '`' + pKey + '` ' + s + ' \'' + val + '\' '
                } else {
                    pKey = pKey.split('.')
                    var sqlPiece = '`' + pKey[0] + '`.`' + pKey[1] + '` ' + s + ' \'' + val + '\' '
                }
                mysql.wheres += mysql.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece)
            } else if (key.toUpperCase() === 'IN') {
                mysql.whereIn(pKey, val)
            } else if (key.toUpperCase() === 'BETWEEN') {
                mysql.whereBtw(pKey, val)
            } else if (key.toUpperCase() === 'LIKE') {
                mysql.whereLike(pKey, val)
            } else {
                //如果字段不存在.字符
                if (key.indexOf('.') == -1) {
                    var sqlPiece = "`" + key + "` = \'" + val + '\' '
                } else {
                    key = key.split('.')
                    var sqlPiece = '`' + key[0] + "`.`" + key[1] + "` = \'" + val + '\' '
                }

                mysql.wheres += mysql.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece)
            }
        }
    }
}

module.exports = (mysql, condition, conjunction) => {
    dealObject(mysql, condition, conjunction)
}