const api = require('./api')
const middle = require('./middle')
const R = require('ramda')
const mysql = require('mysql')

class EasyMydb {
    constructor(dbConfig, tableName) {
        this.options = new Object()
        this.connect(dbConfig)
        this.formatModelToSchema(tableName)
    }

    /**
     * get instance of class by schema name
     * @param tableName
     * @returns {EasyMydb}
     */
    model(tableName) {
        this.loadMiddle()
        this.loadApi()
        return new EasyMydb(this.dbConfig, tableName)
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
        this.connection = this.getConnection()
    }

    /**
     * bind api to class EasyMydb
     */
    loadApi() {
        R.forEachObjIndexed((v, k) => {
            this[k] = (...map) => v(this, map)
        })(api)
    }

    /**
     * bind middle methods
     */
    loadMiddle() {
        R.forEachObjIndexed((v, k) => {
            this[k] = (...map) => v(this, map)
        })(middle)
    }

    /**
     * format model name to schema name
     * @param tableName
     * @returns {*}
     */
    formatModelToSchema(modelName) {
        if (modelName)
            this.schemaName = this.schemaName || ((this.dbConfig.prefix || '') + R.replace(/[_]+/g, '_')(R.toLower(R.replace(/\B([A-Z])/g, '_$1')(modelName))))
    }

    /**
     * define a schema name if model name is not the schema name
     * @param schemaName
     */
    table(schemaName, isPrefix) {
        this.loadMiddle()
        this.loadApi()
        this.schemaName = isPrefix ? (this.dbConfig.prefix || '') + schemaName : schemaName
        return this
    }

    /**
     * get mysql connection
     * @returns {Promise<any>}
     */
    async getConnection() {
        const _this = this
        return await new Promise((resolve, reject) => {
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

    getSelectSql() {
        return ' FROM `' + _instance.schemaName + '` '
        + _instance.options.aliasStr
        + _instance.options.joinStr
        + _instance.getWheres() + ' ' + _instance.options.groups + ' '
        + _instance.getOrders()
        + _instance.getLimits()
    }

    getWheres() {
        this.options.wheres = R.replace(/\s+/g)(' ')(this.options.wheres)
        return !this.options.wheres ? ' WHERE ' + this.options.wheres : ''
    }

    getOrders() {
        return !this.options.orders ? ' ORDER BY ' + this.options.orders : ''
    }

    getLimits() {
        return !this.options.limits ? ' LIMIT ' + this.options.limits : ''
    }

    getLastSql() {
        return R.replace(/\s+/g)(' ')(this.options.sql)
    }

    /**
     * get original mysql
     */
    getMysql() {
        return mysql
    }
}

const config = {host: '127.0.0.1',user: 'root', password: 'root', database: 'bearly.cn', prefix: 'ely_'}
const db = new EasyMydb(config)
var test = db.table('group').query('select * from ely_group')
test.then((data) => {
    console.log(data)
})


