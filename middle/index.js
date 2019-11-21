const R = require('ramda')

const middle = [
    'alias', 'allowFields', 'dec', 'distinct', 'exp', 'fetchSql', 'field', 'group',
    'inc', 'limit', 'mJoin', 'order', 'page', 'where', 'whereBtw', 'whereIn', 'whereLike',
    'whereOr'
]

R.forEach(v => {
    exports[v] = require(`./${v}`)
})(middle)