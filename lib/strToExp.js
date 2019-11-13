const R = require('ramda')
module.exports = (...maps) => {
    const [ string ] = maps
    let s = '=';

    switch (R.toUpper(string)) {
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