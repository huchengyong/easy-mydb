const api = require('./api')
const middle = require('./middle')

const Db = function () {

    this.prefix = ''
    /*最终的sql语句*/
    this.sql = ''
    /*查询要筛选的字段*/
    this.fields = '*'
    /*当前表别名*/
    this.aliasStr = ''
    /*联表查询*/
    this.joinStr = ''
    /*查询排序*/
    this.orders = ''
    /*查询分组*/
    this.groups = ''
    /*查询去重*/
    this.distincts = ''
    /*查询条件*/
    this.wheres = ''
    /*查询分页*/
    this.limits = ''
    /*此表的字段*/
    this.columns = []
    /*添加/更新的字段*/
    this.insertFields = ''
    /*添加/更新的值*/
    this.insertValues = ''
    this.tableName = ''
    this.connection = null
    this.configs = {}
    this.primaryKey = 'id'

    /**
     * @note 获取mysql连接资源
     * @returns {Promise<*>}
     */
    this.connect = (configs) => {
        middle.connect(this, configs)
    };

    this.table = (tableName) => {
        this.tableName = this.prefix + tableName
        return this
    }

    /**
     * @note 原生sql查询
     * @param sql
     * @returns {Promise<*>}
     */
    this.query = (sql) => {
        return api.query(this, sql)
    }

    /**
     * @note 查询多条数据
     * @returns {Promise<*>}
     */
    this.select = () => {
        return api.select(this)
    }

    /**
     * @note 插入单条数据
     * @returns {Promise<void>}
     */
    this.find = (pk) => {
        return api.find(this, pk)
    }

    /**
     * @note 统计数量
     * @returns {*}
     */
    this.count = (field) => {
        return api.count(this, field)
    }

    /**
     * @note 相加
     * @param field
     * @returns {*}
     */
    this.sum = (field) => {
        return api.sum(this, field)
    }

    /**
     * @note 最大值
     * @param field
     * @returns {*}
     */
    this.max = (field) => {
        return api.max(this, field)
    }

    /**
     * @note 最小值
     * @param field
     * @returns {*}
     */
    this.min = (field) => {
        return api.min(this, field)
    }

    /**
     * @note 平均值
     * @param field
     * @returns {*}
     */
    this.avg = (field) => {
        return api.avg(this, field)
    }

    /**
     * @note 插入一条数据
     * @param data 数据 必填
     * @returns {Promise<void>}
     */
    this.insert = (data) => {
        return api.insert(this, data)
    }

    /**
     * @note 批量插入数据
     * @param data
     * @param limit 批次
     * @returns {Promise<void>}
     */
    this.insertAll = (data, limit) => {
        return api.insertAll(this, data, limit)
    }

    /**
     * @note 更新
     * @param data 要更新的数据
     * @returns {Promise<*>}
     */
    this.update = (data) => {
        return api.update(this, data)
    }

    /**
     * @note 删除
     * @param pk
     * @returns {Promise<*>}
     */
    this.delete = (pk) => {
        return api.delete(this, pk)
    }

    /**
     * 释放mysql连接资源
     */
    this.release = () => {
        api.release(this)
    }

    /**
     * @note 声明字段
     * @param fields 字段名
     * @returns {db}
     */
    this.field = (fields) => {
        middle.field(this, fields)
        return this
    }

    /**
     * @note 当前表起别称
     * @param s
     * @returns {Db}
     */
    this.alias = (s) => {
        middle.alias(this, s)
        return this
    }

    /**
     * @note 联表查询
     * @param table
     * @param op
     * @param method
     * @returns {Db}
     */
    this.mJoin = (table, op, method) => {
        middle.mJoin(this, table, op, method)
        return this
    }

    /**
     * @note where条件
     * @param field 字段名 必填
     * @param op 表达式 选填
     * @param condition 条件 选填
     * @param conjunction 连词
     * @returns {db}
     */
    this.where = (field, op, condition, conjunction) => {
        conjunction = conjunction == undefined ? 'AND' : conjunction
        middle.where(this, field, op, condition, conjunction)
        return this
    }

    /**
     * @whereOr条件
     * @param field 字段名 必填
     * @param op 连词 选填
     * @param condition 条件 选填
     * @returns {db}
     */
    this.whereOr = (field, op, condition) => {
        middle.where(this, field, op, condition, 'OR')
        return this
    }

    /**
     *
     * @note whereIn条件
     * @param field 字段名
     * @param condition IN条件
     * @returns {db}
     */
    this.whereIn = (field, condition) => {
        middle.whereIn(this, field, condition)
        return this
    }

    /**
     * @note whereBetween条件
     * @param field 字段名 必填
     * @param condition between条件 选填
     * @returns {db}
     */
    this.whereBtw = (field, condition) => {
        middle.whereBtw(this, field, condition)
        return this
    }

    /**
     * @note whereLike条件
     * @param field 字段名 必填
     * @param condition 条件 选填
     * @returns {db}
     */
    this.whereLike = (field, condition) => {
        middle.whereLike(this, field, condition)
        return this;
    }

    /**
     * @note 排序
     * @param field 字段名 必填
     * @param orderBy 排序规则
     * @returns {db}
     */
    this.order = (field, orderBy) => {
        middle.order(this, field, orderBy)
        return this
    }

    /**
     * @note 分组
     * @param field 字段名
     * @returns {db}
     */
    this.group = (field) => {
        middle.group(this, field)
        return this
    }

    /**
     * @note 去重
     * @param field
     * @returns {db}
     */
    this.distinct = (field) => {
        middle.distincts(this, field)
        return this
    }

    /**
     * @note 偏移
     * @param start 开始
     * @param offset 偏移量
     */
    this.limit = (start, offset) => {
        middle.limit(this, start, offset)
        return this
    }

    /**
     * @note 分页查询
     * @param p
     * @param offset
     * @returns {Db}
     */
    this.page = (p, offset) => {
        middle.page(this, p, offset)
        return this
    }

    /**
     * @note 这是主键字段
     * @param primaryKey
     */
    this.setPrimaryKey = (primaryKey) => {
        api.setPrimaryKey(this, primaryKey)
    }

    this.getLimits = () => {
        return this.limits == '' ? '' : ' LIMIT ' + this.limits
    }

    /**
     * @note 返回where语句
     * @returns {string}
     */
    this.getWheres = () => {
        this.wheres = (this.wheres).replace(/\s+/g, ' ');
        return this.wheres == '' ? '' : ' WHERE ' + this.wheres
    }

    /**
     * @note 返回order条件
     * @returns {string}
     */
    this.getOrders = () => {
        return this.orders == '' ? '' : ' ORDER BY ' + this.orders
    }

    /**
     * @note 获取主键字段名
     * @returns {Promise<*|string>}
     */
    this.getPrimaryKey = () => {
        return api.getPrimaryKey();
    }

    /**
     * @note 获取最后一条sql语句
     * @returns {*}
     */
    this.getLastSql = () => {
        return api.getLastSql(this)
    }

    return this
}
module.exports = Db

const db = new Db()
let config = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test'
}
db.connect(config)

async function test() {
    console.log(await db
        .table('user')
        .field('u.name')
        .alias('u')
        .mJoin('goods as g', 'u.id = g.id')
        .whereBtw('u.id', '1,100')
        .whereLike('u.name', '%h%')
        .whereIn('u.id', [1,2,3,4,5,6,7,8,9])
        .page(1,10)
        .order('u.id', 'desc')
        .group('u.id')
        .select())
    console.log(await db.table('user').whereBtw('id', '1,3').where({'name':{like:'%h%'}}).whereIn('id', [1,2,3,4,5,6,7,8,9]).order('id', 'desc').group('id').select())
}
test()

db.release()