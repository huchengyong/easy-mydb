const alias = require('./alias')
const connect = require('./connect')
const distincts = require('./distincts')
const field = require('./field')
const group = require('./group')
const limit = require('./limit')
const mJoin = require('./mJoin')
const order = require('./order')
const page = require('./page')
const where = require('./where')
const whereBtw = require('./whereBtw')
const whereIn = require('./whereIn')
const whereLike = require('./whereLike')

module.exports = {
    alias: (mysql, s) => alias(mysql, s),
    connect: (mysql, configs) => connect(mysql, configs),
    distincts: (mysql, field) => distincts(mysql, field),
    field: (mysql, fields) => field(mysql, fields),
    group: (mysql, field) => group(mysql, field),
    limit: (mysql, start, offset) => limit(mysql, start, offset),
    mJoin: (mysql, table, op, method) => mJoin(mysql, table, op, method),
    order: (mysql, field, orderBy) => order(mysql, field, orderBy),
    page: (mysql, p, offset) => page(mysql, p, offset),
    where: (mysql, field, op, condition, conjunction) => where(mysql, field, op, condition, conjunction),
    whereBtw: (mysql, field, condition) => whereBtw(mysql, field, condition),
    whereIn: (mysql, field, condition) => whereIn(mysql, field, condition),
    whereLike: (mysql, field, condition) => whereLike(mysql, field, condition),
}