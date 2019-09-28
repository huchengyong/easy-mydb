/**
 * @note 将字符串转化为表达式
 * @param string
 * @returns {string}
 */
module.exports = (string) => {
    let s = '=';

    switch (string.toUpperCase()) {
        case 'EQ':
            s = '=';
            break;
        case 'NEQ':
            s = '<>';
            break;
        case 'GT':
            s = '>';
            break;
        case 'EGT':
            s = '>=';
            break;
        case 'LT':
            s = '<';
            break;
        case 'ELT':
            s = '<=';
            break;
        case 'LIKE':
            s = 'LIKE';
            break;
        default:
            break;
    }
    return s;
}