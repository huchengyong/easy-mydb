const R = require('ramda')

const middle = [
    'alias', 'dec', 'distinct', 'exp', 'fetchSql', 'field', 'group',
    'inc', 'limit', 'mJoin', 'order', 'page', 'strict', 'where', 'whereBtw', 'whereIn', 'whereLike',
    'whereNotBtw', 'whereNotIn', 'whereNotLike', 'whereNull', 'whereNotNull', 'whereOr'
]

R.forEach(v => {
    exports[v] = require(`./${v}`)
})(middle)