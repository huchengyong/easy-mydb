module.exports = (mysql) => {
    return (mysql.sql).replace(/\s+/g, ' ')
}