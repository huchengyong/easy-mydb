const avg = require('./avg')
const count = require('./count')
const del = require('./delete')
const find = require('./find')
const getLastSql = require('./getLastSql')
const getPrimaryKey = require('./getPrimaryKey')
const insert = require('./insert')
const insertAll = require('./insertAll')
const max = require('./max')
const min = require('./min')
const query = require('./query')
const release = require('./release')
const select = require('./select')
const setPrimaryKey = require('./setPrimaryKey')
const sum = require('./sum')
const setDec = require('./setDec')
const setField = require('./setField')
const setInc = require('./setInc')
const update = require('./update')

const R = require('ramda')

const api1 = ['avg', 'count', 'del', 'find', 'getLastSql', 'getPrimaryKey', 'insert', 'insertAll']
const api2 = ['max', 'query', 'select', 'setPrimaryKey', 'sum', 'setDec', 'setField']
const api = R.concat(api1, api2)

R.map(
    R.compose(
        require,
        i => `./${i}`
    )
)(api)


module.exports = {
    avg: (field) => avg(field).bind(this),
    count: (field) => count(field).bind(this),
    delete: (pk) => del(pk).bind(this),
    find: (pk) => find(pk).bind(this),
    getLastSql: () => getLastSql().bind(this),
    getPrimaryKey: () => getPrimaryKey().bind(this),
    insert: (data) => insert(data).bind(this),
    insertAll: (data) => insertAll(data).bind(this),
    max: (field) => max(field).bind(this),
    min: (field) => min(field).bind(this),
    query: (sql) => query(sql).bind(this),
    release: () => release().bind(this),
    select: () => select().bind(this),
    setPrimaryKey: (primaryKey) => setPrimaryKey(primaryKey).bind(this),
    sum: (field) => sum(field).bind(this),
    setDec: (field, value) => setDec(field, value).bind(this),
    setField: (field, value) => setField(field, value).bind(this),
    setInc: (field, value) => setInc(field, value).bind(this),
    update: (data) => update(data).bind(this)
}