module.exports = _instance => {
    _instance.connection.then((connection) => {
        console.log('heare');
        connection.destroy();
    })
}