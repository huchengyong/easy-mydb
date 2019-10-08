const del = require('./delete')
const find = require('./find')
const getLastSql = require('./getLastSql')
const getPrimaryKey = require('./getPrimaryKey')
const insert = require('./insert')
const insertAll = require('./insertAll')
const query = require('./query')
const release = require('./release')
const select = require('./select')
const setPrimaryKey = require('./setPrimaryKey')
const update = require('./update')

module.exports = {
    delete: (mysql) => del(mysql),
    find: (mysql, pk) => find(mysql, pk),
    getLastSql: (mysql) => getLastSql(mysql),
    getPrimaryKey: (mysql) => getPrimaryKey(mysql),
    insert: (mysql, data) => insert(mysql, data),
    insertAll: (mysql, data) => insertAll(mysql, data),
    query: (mysql, sql) => query(mysql, sql),
    release: (mysql) => release(mysql),
    select: (mysql) => select(mysql),
    setPrimaryKey: (mysql, primaryKey) => setPrimaryKey(mysql, primaryKey),
    update: (mysql, data) => update(mysql, data)
}