const mysql = require('mysql')
const api = require('./api')

const Db = function () {

    this.prefix = ''
    /*最终的sql语句*/
    this.sql = ''
    /*查询要筛选的字段*/
    this.fields = '*'
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
    this.insertValues = '';
    this.tableName = ''
    this.connection = null
    this.configs = {}
    this.primaryKey = 'id'

    /**
     * @note 获取mysql连接资源
     * @returns {Promise<*>}
     */
    this.connect = (configs) => {
        if (typeof configs !== 'object') throw 'Connection failed. Please check configuration parameters'

        this.configs = configs

        if (this.connection === null) {
            const pool = mysql.createPool({
                connectionLimit: configs.limit || 10,
                host: configs.host,
                user: configs.user,
                password: configs.password,
                database: configs.database
            });
            this.connection = new Promise((resolve) => {
                pool.getConnection((err, connection) => {
                    if (err) throw err
                    resolve(connection);
                })
            })
        }
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
        return api.query(this, sql);
    };

    /**
     * @note 查询多条数据
     * @returns {Promise<*>}
     */
    this.select = () => {
        return api.select(this);
    };

    /**
     * @note 插入单条数据
     * @returns {Promise<void>}
     */
    this.find = async (pk) => {
        return api.find(this, pk);
    };

    /**
     * @note where条件
     * @param field 字段名 必填
     * @param op 表达式 选填
     * @param condition 条件 选填
     * @param conjunction 连词
     * @returns {db}
     */
    this.where = (field, op, condition, conjunction) => {
        conjunction = conjunction == undefined ? 'AND' : conjunction;
        if (op != undefined && condition != undefined) {
            switch (op.toUpperCase()) {
                case 'IN':
                    if (typeof condition === 'object') {
                        this.whereIn(field, condition);
                    } else if (typeof condition === 'string') {
                        condition = condition.split(',');
                        this.whereIn(field, condition);
                    }
                    break;
                case 'BETWEEN':
                    if (typeof condition === 'object') {
                        this.whereBtw(field, condition);
                    }
                    break;
                case 'LIKE':
                    this.whereLike(field, condition);
                    break;
                default :
                    let wheres = ' `' + field + '` ' + op + ' \'' + condition + '\'';
                    this.wheres += this.wheres == '' ? wheres : (' ' + conjunction + ' ' + wheres);
                    break;
            }
        } else if (op != undefined) {
            let wheres = ' `' + field + '` = \'' + op + '\'';
            this.wheres += this.wheres == '' ? wheres : (' ' + conjunction + ' ' + wheres);
        } else {
            switch (typeof field) {
                case 'object':
                    this.dealObject(field, conjunction);
                    break;
                case 'string':
                    this.wheres += this.wheres == '' ? field : (' ' + conjunction + ' ' + field);
                    break;
                default:
                    this.wheres += '';
                    break;
            }
        }
        return this;
    };

    /**
     * @whereOr条件
     * @param field 字段名 必填
     * @param op 连词 选填
     * @param condition 条件 选填
     * @returns {db}
     */
    this.whereOr = (field, op, condition) => {
        this.where(field, op, condition, 'OR');
        return this;
    };

    /**
     *
     * @note whereIn条件
     * @param field 字段名
     * @param condition IN条件
     * @returns {db}
     */
    this.whereIn = (field, condition) => {
        if (condition != undefined) {
            if (typeof condition === 'object') {
                condition = condition.join('\',\'');
            }
            let where = '`' + field + '` IN (\'' + condition + '\')';
            this.wheres += this.wheres == '' ? where : ' AND ' + where;
        } else {
            if (typeof field === 'object') {
                for (let k in field) {
                    let v = field[k];
                    this.whereIn(k, v);
                }
            }
        }
        return this;
    };

    /**
     * @note whereBetween条件
     * @param field 字段名 必填
     * @param condition between条件 选填
     * @returns {db}
     */
    this.whereBtw = (field, condition) => {
        if (condition != undefined) {
            if (typeof condition === 'object') {
                let where = '`' + field + '` BETWEEN \'' + condition[0] + '\' AND \'' + condition[1] + '\'';
                this.wheres += this.wheres == '' ? where : ' AND ' + where;
            }
        } else {
            if (typeof field === 'object') {
                for (let k in field) {
                    let v = field[k];
                    this.whereBtw(k, v);
                }
            }
        }
        return this;
    };

    /**
     * @note whereLike条件
     * @param field 字段名 必填
     * @param condition 条件 选填
     * @returns {db}
     */
    this.whereLike = (field, condition) => {
        if (condition != undefined) {
            if (typeof condition === 'string') {
                let where = '`' + field + '` LIKE \'' + condition + '\'';
                this.wheres += this.wheres == '' ? where : ' AND ' + where;
            }
        } else {
            if (typeof field === 'object') {
                for (let k in field) {
                    let v = field[k];
                    this.whereLike(k, v);
                }
            }
        }
        return this;
    };

    /**
     * @note 排序
     * @param field 字段名 必填
     * @param order 排序规则
     * @returns {db}
     */
    this.order = (field, order) => {
        if (order != undefined) {
            if (typeof order === 'object') {
                for (let k in order) {
                    let v = order[k];
                    this.order(k, v);
                }
            } else if (typeof order === 'string') {
                let orders = '`' + field + '`' + ' ' + order.toUpperCase();
                this.orders += this.orders == '' ? orders : ',' + orders;
            }
        } else {
            if (typeof field === 'object') {
                for (let k in field) {
                    let v = field[k];
                    this.order(k, v);
                }
            } else {
                this.orders += this.orders == '' ? field : ',' + field;
            }
        }
        return this;
    };

    /**
     * @note 分组
     * @param field 字段名
     * @returns {db}
     */
    this.group = (field) => {
        if (typeof field === 'string' && field != '') {
            let groups = field.split(',');

            groups = groups.join('`,`');
            groups = groups == '' ? '' : ('`' + groups + '`');

            this.groups = ' GROUP BY ' + groups;
        }
        return this;
    };

    /**
     * @note 去重
     * @param field
     * @returns {db}
     */
    this.distinct = (field) => {
        if (typeof field === 'string' && field != '') {
            let distinct = field.split(',');

            distinct = distinct.join('`,`');
            distinct = distinct == '' ? '' : ('`' + distinct + '`');

            this.distincts = ' DISTINCT ' + distinct;
        }
        return this;
    };

    /**
     * @note 偏移
     * @param start 开始
     * @param offset 偏移量
     */
    this.limit = (start, offset) => {
        if (offset != undefined) {
            this.limits = start + ',' + offset;
        } else {
            this.limits = start;
        }
        return this;
    };

    /**
     * @note 声明字段
     * @param fields 字段名
     * @returns {db}
     */
    this.field = (fields) => {
        this.fields = fields || '*';
        if (this.fields !== '*') {
            let filedsArr = this.fields.split(',');
            let filedsStr = '';
            for (let k = 0; k < filedsArr.length; k++) {
                filedsStr += '`' + filedsArr[k] + '`,';
            }
            this.fields = filedsStr.substr(0, filedsStr.length - 1);
        }
        return this;
    };

    /**
     * @note 插入一条数据
     * @param data 数据 必填
     * @returns {Promise<void>}
     */
    this.insert = async (data) => {
        await this.setColumns();
        if (typeof data === 'object') {
            for (let k in data) {
                if (this.inColumns(k)) {
                    let field = '`' + k + '`';
                    this.insertFields += this.insertFields == '' ? field : (',' + field);
                    let v = data[k];
                    if (typeof v === 'string' || typeof v === 'number') {
                        let value = '\'' + v + '\'';
                        this.insertValues += this.insertValues == '' ? value : (',' + value);
                    }
                }
            }
        }
        this.sql = 'INSERT INTO' + ' `' + this.tableName + '` (' + this.insertFields + ') VALUE (' + this.insertValues + ')';
        return await this.query(this.sql);
    };

    /**
     * @note 更新
     * @param data 要更新的数据
     * @returns {Promise<*>}
     */
    this.update = async (data) => {
        let wheres = this.getWheres();
        await this.setColumns();
        this.dealData(data);
        let sql = this.setUpdate();
        this.sql = 'UPDATE `' + this.tableName + '` SET ' + sql + wheres;
        return await this.query(this.sql);
    };

    /**
     * @note 删除
     * @param pk
     * @returns {Promise<*>}
     */
    this.delete = (pk) => {
        return api.delete(this, pk)
    };

    this.release = () => {
        api.release(this)
    }

    this.setPrimaryKey = (primaryKey) => {
        api.setPrimaryKey(this, primaryKey)
    }

    /**
     * @note 处理update的参数数据
     * @param data
     */
    this.dealData = (data) => {
        if (typeof data === 'object') {
            for (let k in data) {
                let v = data[k];
                if (typeof v === 'object') {
                    this.dealData(v);
                } else {
                    if (this.inColumns(k)) {
                        let field = '`' + k + '`';
                        let value = '\'' + v + '\'';
                        this.insertFields += this.insertFields == '' ? field : (',' + field);
                        this.insertValues += this.insertValues == '' ? value : (',' + value);
                    }
                }
            }
        }
    };

    /**
     * @note 更新字段的语句
     * @returns {string}
     */
    this.setUpdate = () => {
        let fields = this.insertFields.split(',');
        let values = this.insertValues.split(',');

        let sql = '';
        for (let i = 0; i < fields.length; i++) {
            let str = fields[i] + ' = ' + values[i];
            sql += sql == '' ? str : (',' + str);
        }
        return sql;
    };

    /**
     * @note 批量插入数据
     * @param data
     * @param limit 批次
     * @returns {Promise<void>}
     */
    this.insertAll = async (data, limit) => {
        await this.setColumns();
        if (typeof data === 'object') {
            for (let k in data[0]) {
                if (this.inColumns(k)) {
                    this.insertFields += this.insertFields == '' ? ('(' + '`' + k + '`') : (',`' + k + '`');
                }
            }
            this.insertFields += ')';
            for (let key in data) {
                let val = data[key];
                if (typeof val === 'object') {
                    this.insertValues += this.insertValues == '' ? '(' : ',(';
                    for (let k in val) {
                        if (this.inColumns(k)) {
                            let v = val[k];
                            this.insertValues += '\'' + v + '\',';
                        }
                    }
                    let f = this.insertValues.substr(0, this.insertValues.lastIndexOf(',') - 1) + '\'';
                    this.insertValues = f + ')';
                }
            }
        }
        this.sql = 'INSERT INTO' + ' `' + this.tableName + '` ' + this.insertFields + ' VALUE ' + this.insertValues + '';
        return await this.query(this.sql);
    };

    /**
     * @note 处理where条件对象
     * @param condition 条件
     * @param exp 表达式
     * @param pKey
     */
    this.dealObject = (condition, exp, pKey) => {
        for (let key in condition) {
            let val = condition[key];

            if (typeof val === 'object') {
                switch (key.toUpperCase()) {
                    case 'IN':
                        this.whereIn(key, val);
                        break;
                    case 'BETWEEN':
                        this.whereBtw(key, val);
                        break;
                    default:
                        break;
                }
                this.dealObject(val, exp, key);
            } else {
                //是否关键字 gt lt ...等
                if (this.isKeyWord(key)) {
                    let s = this.strToExp(key);
                    let sqlPiece = '`' + pKey + '` ' + s + ' \'' + val + '\' ';
                    this.wheres += this.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece);
                } else if (key.toUpperCase() === 'LIKE') {
                    this.whereLike(key, val);
                } else {
                    let sqlPiece = "`" + key + "` = \'" + val + '\' ';
                    this.wheres += this.wheres == '' ? sqlPiece : (' ' + exp + ' ' + sqlPiece);
                }
            }
        }
    };

    /**
     * @note 是否是关键词
     * @param key
     * @returns {boolean}
     */
    this.isKeyWord = (key) => {
        let keyWords = ['EQ', 'NEQ', 'GT', 'EGT', 'LT', 'ELT', 'LIKE'];

        if (keyWords.indexOf(key.toUpperCase()) !== -1) {
            return true;
        }
        return false;
    };

    this.getLimits = () => {
        return this.limits == '' ? '' : ' LIMIT ' + this.limits;
    };

    /**
     * @note 返回where语句
     * @returns {string}
     */
    this.getWheres = () => {
        this.wheres = (this.wheres).replace(/\s+/g, ' ');
        return this.wheres == '' ? '' : ' WHERE ' + this.wheres;
    };

    /**
     * @note 返回order条件
     * @returns {string}
     */
    this.getOrders = () => {
        return this.orders == '' ? '' : ' ORDER BY ' + this.orders;
    };

    /**
     * @note 获取主键字段名
     * @returns {Promise<*|string>}
     */
    this.getPrimaryKey = async () => {
        let sql = "SELECT " +
            "k.column_name " +
            "FROM " +
            "information_schema.table_constraints t " +
            "JOIN information_schema.key_column_usage k USING ( constraint_name, table_schema, table_name ) " +
            "WHERE " +
            "t.constraint_type = 'PRIMARY KEY' " +
            "AND t.table_schema = '" + this.configs.database + "' AND t.table_name = '" + this.tableName + "'";
        let pk = await this.query(sql);
        return pk[0].column_name || '';
    };

    /**
     * @note 设置表中的所有字段
     * @returns {Promise<Array>}
     */
    this.setColumns = async () => {
        let sql = 'DESC `' + this.tableName + '`';
        let result = await this.query(sql);

        let columns = [];
        let i = 0;
        for (let k in result) {
            columns[i] = result[k].Field;
            i++;
        }
        this.columns = columns;
    };

    /**
     * @note 判断字段是否在表中存在
     * @param k 字段
     * @returns {boolean}
     */
    this.inColumns = (k) => {
        return this.columns.indexOf(k) != -1;
    };

    /**
     * @note 将字符串转化为表达式
     * @param string
     * @returns {string}
     */
    this.strToExp = (string) => {
        let s = '=';

        switch (string.toUpperCase()) {
            case 'EQ':
                s = '=';
                break;
            case 'NEQ':
                s = '<>';
                break;
            case 'GT':
                s = '>';
                break;
            case 'EGT':
                s = '>=';
                break;
            case 'LT':
                s = '<';
                break;
            case 'ELT':
                s = '<=';
                break;
            case 'LIKE':
                s = 'LIKE';
                break;
            default:
                break;
        }
        return s;
    };

    return this;
};
module.exports = Db

let db = new Db();

db.connect({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test'
})

// let r1 = db.table('user').where({id:18}).select()
// let r2 = db.table('user').where({id:19}).select()
let r3 = db.table('goods').where({id:1}).find()
let r4 = db.table('user').find(3)

// r1.then((d) => {
//     console.log(d)
// })
//
// r2.then((d) => {
//     console.log(d)
// })

r3.then((d) => {
    console.log(d)
})

r4.then((d) => {
    console.log(d)
})

db.release()