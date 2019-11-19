const R = require('ramda')

const api = [
    'avg', 'count', 'del', 'find', 'getPk', 'insert', 'insertAll',
    'max', 'min', 'query', 'release', 'select', 'setDec', 'setField', 'setInc',
    'setPk', 'sum', 'update'
]

R.forEach(v => {
    exports[v] = require(`./${v}`)
})(api)