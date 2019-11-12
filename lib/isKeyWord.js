const R = require('ramda')
module.exports = maps => {
    const [ key ] = maps
    let keyWords = ['EQ', 'NEQ', 'GT', 'EGT', 'LT', 'ELT', 'LIKE'];

    if (R.indexOf(R.toUpper(key))(keyWords) !== -1) {
        return true;
    }
    return false;
}