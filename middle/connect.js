const db = require('mysql')

module.exports = (mysql, configs) => {
    if (typeof configs !== 'object') throw 'Connection failed. Please check configuration parameters'

    mysql.configs = configs

    if (mysql.connection === null) {
        const pool = db.createPool({
            connectionLimit: configs.limit || 10,
            host: configs.host,
            user: configs.user,
            password: configs.password,
            database: configs.database
        });
        mysql.connection = new Promise((resolve) => {
            pool.getConnection((err, connection) => {
                if (err) throw err
                resolve(connection)
            })
        })
    }
}