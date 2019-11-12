const R = require('ramda')

const api = [
    'avg', 'count', 'del', 'find', 'getPrimaryKey', 'insert', 'insertAll',
    'max', 'query', 'select', 'setPrimaryKey', 'sum', 'setDec', 'setField'
]

R.forEach(v => {
    exports[v] = require(`./${v}`)
})(api)