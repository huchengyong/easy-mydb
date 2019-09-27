module.exports = function (mysql) {
    return (mysql.sql).replace(/\s+/g, ' ')
}