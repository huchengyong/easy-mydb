const api = require('./api')
const middle = require('./middle')
const R = require('ramda')
const mysql = require('mysql')

class EasyMydb {
    constructor(dbConfig, tableName) {
        this.options = new Object()
        // this.loadApi()
        // this.loadMiddle()
        this.connect(dbConfig)
        this.formatModelToSchema(tableName)
    }

    /**
     * get instance of class by schema name
     * @param tableName
     * @returns {EasyMydb}
     */
    model(tableName) {
        return new EasyMydb(this.dbConfig, tableName)
    }

    async query(sql) {
        return await this.getQuery(sql)
    }

    getQuery(sql) {
        const _this = this
        this.options.sql = sql

        //fetch sql
        if (this.options.isSql === true) {
            this.options.isSql = null
            return this.options.sql
        } else {
            return new Promise((resolve, reject) => {
                _this.connection.query(_this.options.sql, (error, results, fields) => {
                    this.connection.release()
                    if (error) reject(error)
                    console.log(fields)
                    resolve(eval('(' + JSON.stringify(results) + ')'))
                })
            })
        }
    }

    /**
     * connect mysql
     * @param config
     * @returns {Promise<void>}
     */
    async connect(config) {
        this.dbConfig = config
        this.pool = mysql.createPool({
            connectionLimit: this.dbConfig.limit || 10,
            host: this.dbConfig.host || '',
            user: this.dbConfig.user || '',
            password: this.dbConfig.password || '',
            database: this.dbConfig.database || ''
        })
        this.connection = await this.getConnection()
    }

    /**
     * bind api to class EasyMydb
     */
    loadApi() {
        R.forEachObjIndexed((v, k) => {
            this[k] = v.bind(this)
        })(api)
    }

    /**
     * bind middle methods
     */
    loadMiddle() {
        R.forEachObjIndexed((v, k) => {
            this[k] = v.bind(this)
        })(middle)
    }

    /**
     * format model name to schema name
     * @param tableName
     * @returns {*}
     */
    formatModelToSchema(modelName) {
        if (modelName)
            this.options.schemaName = this.options.schemaName || ((this.dbConfig.prefix || '') + R.replace(/[_]+/g, '_')(R.toLower(R.replace(/\B([A-Z])/g, '_$1')(modelName))))
    }

    /**
     * define a schema name if model name is not the schema name
     * @param schemaName
     */
    table(schemaName, isPrefix) {
        this.options.schemaName = isPrefix ? (this.dbConfig.prefix || '') + schemaName : schemaName
    }

    /**
     * get mysql connection
     * @returns {Promise<any>}
     */
    getConnection() {
        const _this = this
        return new Promise((resolve, reject) => {
            _this.pool.getConnection((err, connection) => {
                if (err) reject(err)
                resolve(connection)
            })
        })
    }

    /**
     * return original sql, rather than query result
     * @returns {EasyMydb}
     */
    fetchSql() {
        this.options.isSql = true
        return this
    }

    getLastSql() {
        return this.options.sql
    }

    /**
     * get original mysql
     */
    getMysql() {
        return mysql
    }
}

const config = {host: '127.0.0.1',user: 'root', password: '123456', database: 'test', prefix: 'ely_'}
const db = new EasyMydb(config)
db.table('ug')
const User = db.model('User')
const Goods = db.model('Goods')

console.log(db)
console.log(User)
console.log(Goods)
