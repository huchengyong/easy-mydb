module.exports = _instance => {
    _instance.connection.then((connection) => {
        connection.release();
    })
}