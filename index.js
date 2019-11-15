const api = require('./api')
const middle = require('./middle')
const R = require('ramda')
const mysql = require('mysql')

class EasyMydb {
    constructor(dbConfig, tableName) {
        this.options = {
            wheres: '',
            orders: '',
            groups: '',
            updateExp: '',
            insertFields: '',
            insertValues: ''
        }
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
            this[k] = (...maps) => v(this, maps)
        })(api)
    }

    /**
     * bind middle methods
     */
    loadMiddle() {
        R.forEachObjIndexed((v, k) => {
            this[k] = (...maps) => {
                v(this, maps)
                return this
            }
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
    table(schemaName) {
        this.loadMiddle()
        this.loadApi()
        this.schemaName = (this.dbConfig.prefix || '') + schemaName
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
        this.isSql = true
        return this
    }

    getSelectSql() {
        return ' FROM `' + this.schemaName + '` '
        + (this.options.aliasStr || '')
        + (this.options.joinStr || '')
        + this.getWheres() + ' ' + (this.options.groups || '') + ' '
        + this.getOrders()
        + this.getLimits()
    }

    getWheres() {
        this.options.wheres = R.replace(/\s+/g)(' ')(this.options.wheres || '')
        return !this.options.wheres ? '' : ' WHERE ' + this.options.wheres
    }

    getOrders() {
        return !this.options.orders ? '' : ' ORDER BY ' + this.options.orders
    }

    getLimits() {
        return !this.options.limits ? '' : ' LIMIT ' + this.options.limits
    }

    getLastSql() {
        return R.replace(/\s+/g)(' ')(this.sql || '')
    }

    /**
     * get original mysql
     */
    getMysql() {
        return mysql
    }
}

const config = {host: '127.0.0.1',user: 'root', password: '123456', database: 'test'}
const db = new EasyMydb(config)
async function test()
{
    let a = await db.table('user')
        .where([{id:1},{age:{in:[1,2,3]}},{name:'New'}])
        .whereBtw({sex: [1,4]})
        .whereIn({id: '1,2,3,4,5,6'})
        .whereLike('name', '%Times%').whereOr({age:1}).where([{sex:1}]).group('id').order({id:'asc'}).fetchSql().select();
    let b = await db.table('user')
        .where([{id:1},{age:{in:[1,2,3]}},{name:'New'}])
        .whereBtw({sex: [1,4]})
        .whereIn({id: '1,2,3,4,5,6'})
        .whereLike('name', '%Times%').whereOr({age:1}).where([{sex:1}]).group('id').order({id:'desc'}).select();
    // let c = await db.table('user').where({id:{in:[1,2,3,4]}}).fetchSql().select();
    // let d = await db.table('user').where({id:{between:[1,5]}}).select();
    // let e = await db.table('user').where([{id:1},{name:'New'}]).select();
    console.log(a)
    console.log(b)
}
test()
db.table('user').release()


