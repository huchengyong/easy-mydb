const select = require('./select')
const query = require('./query')
const lib = require('../lib')

module.exports = function (mysql, pk) {
    if (pk != undefined) {
        let where = {}
        where[mysql.primaryKey] = pk
        mysql.where(where).limit(1)
    } else {
        mysql.limit(1)
    }
    return select(mysql)
}