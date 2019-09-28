const select = require('./select')

module.exports = (mysql, pk) => {
    if (pk != undefined) {
        let where = {}
        where[mysql.primaryKey] = pk
        mysql.where(where).limit(1)
    } else {
        mysql.limit(1)
    }
    return select(mysql)
}