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
        this.loadMiddle()
        this.loadApi()
    }

    /**
     * get instance of class by schema name
     * @param tableName
     * @returns {EasyMydb}
     */
    model(tableName) {
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

const config = {host: '127.0.0.1',user: 'root', password: 'root', database: 'bearly.cn',prefix:'ely_'}
const db = new EasyMydb(config)
const Group = db.model('group')
async function test()
{
    let res = await Group.insertAll([
            {groupName:'Hu',rules:'1,2,3',parentId:1}, 
            {groupName:'HuChe',rules:'1,2,3',parentId:1},
            {groupName:'HuCheng',rules:'1,2,3',parentId:1},
            {groupName:'HuChengYong',rules:'1,2,3',parentId:1}
            ],4)
    console.log(res)
}
test()
Group.release()


