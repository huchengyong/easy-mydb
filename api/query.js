module.exports = (mysql, sql) => {
    if (mysql.tableName === '')
        throw 'Undefined tableName. Please use table() define tableName'

    /*执行结束后初始化数据*/
    mysql.fields = '*';
    mysql.orders = '';
    mysql.groups = '';
    mysql.distincts = '';
    mysql.wheres = '';
    mysql.insertFields = '';
    mysql.insertValues = '';
    mysql.aliasStr = '';
    mysql.joinStr = '';
    mysql.limits = '';

    return new Promise((resolve) => {
        mysql.connection.then((connection) => {
            console.log(sql)
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