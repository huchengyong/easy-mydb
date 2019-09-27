module.exports = function (mysql) {
    mysql.connection.then((connection) => {
        connection.release();
    })
}