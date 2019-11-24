const R = require('ramda')

const middle = [
    'alias', 'allowFields', 'dec', 'distinct', 'exp', 'fetchSql', 'field', 'group',
    'inc', 'limit', 'mJoin', 'order', 'page', 'where', 'whereBtw', 'whereIn', 'whereLike',
    'whereNotBtw', 'whereNotIn', 'whereNotLike', 'whereNull', 'whereNotNull', 'whereOr'
]

R.forEach(v => {
    exports[v] = require(`./${v}`)
})(middle)