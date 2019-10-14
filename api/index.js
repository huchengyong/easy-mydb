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

module.exports = {
    avg: (mysql, field) => avg(mysql, field),
    count: (mysql, field) => count(mysql, field),
    delete: (mysql, pk) => del(mysql, pk),
    find: (mysql, pk) => find(mysql, pk),
    getLastSql: (mysql) => getLastSql(mysql),
    getPrimaryKey: (mysql) => getPrimaryKey(mysql),
    insert: (mysql, data) => insert(mysql, data),
    insertAll: (mysql, data) => insertAll(mysql, data),
    max: (mysql, field) => max(mysql, field),
    min: (mysql, field) => min(mysql, field),
    query: (mysql, sql) => query(mysql, sql),
    release: (mysql) => release(mysql),
    select: (mysql) => select(mysql),
    setPrimaryKey: (mysql, primaryKey) => setPrimaryKey(mysql, primaryKey),
    sum: (mysql, field) => sum(mysql, field),
    setDec: (mysql, field, value) => setDec(mysql, field, value),
    setField: (mysql, field, value) => setField(mysql, field, value),
    setInc: (mysql, field, value) => setInc(mysql, field, value),
    update: (mysql, data) => update(mysql, data)
}