module.exports = (mysql) => {
    mysql.connection.then((connection) => {
        connection.release();
    })
}