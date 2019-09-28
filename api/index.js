const find = require('./find')
const insert = require('./insert')
const select = require('./select')
const update = require('./update')
const insertAll = require('./insertAll')
const query = require('./query')
const del = require('./delete')
const getLastSql = require('./getLastSql')
const getPrimaryKey = require('./getPrimaryKey')
const release = require('./release')
const setPrimaryKey = require('./setPrimaryKey')

module.exports = {
    find: (mysql, pk) => find(mysql, pk),
    insert: (mysql) => insert(mysql),
    select: (mysql) => select(mysql),
    update: (mysql) => update(mysql),
    insertAll: (mysql) => insertAll(mysql),
    query: (mysql, sql) => query(mysql, sql),
    delete: (mysql) => del(mysql),
    getLastSql: (mysql) => getLastSql(mysql),
    getPrimaryKey: (mysql) => getPrimaryKey(mysql),
    setPrimaryKey: (mysql, primaryKey) => setPrimaryKey(mysql, primaryKey),
    release: (mysql) => release(mysql)
}