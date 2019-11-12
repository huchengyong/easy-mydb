/**
 * @note 是否是关键词
 * @param key
 * @returns {boolean}
 */
module.exports = (key) => {
    let keyWords = ['EQ', 'NEQ', 'GT', 'EGT', 'LT', 'ELT', 'LIKE'];

    if (keyWords.indexOf(key.toUpperCase()) !== -1) {
        return true;
    }
    return false;
}