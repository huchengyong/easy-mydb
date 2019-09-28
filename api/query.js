module.exports = (mysql, sql) => {
    if (mysql.tableName === '')
        throw 'Undefined tableName. Please use table() define tableName'

    /*执行结束后初始化数据*/
    mysql.orders = '';
    mysql.wheres = '';
    mysql.insertFields = '';
    mysql.insertValues = '';

    return new Promise((resolve) => {
        mysql.connection.then((connection) => {
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    throw error
                } else {
                    resolve(eval('(' + JSON.stringify(results) + ')'))
                }
            });
        })
    })
}