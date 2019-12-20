# easy-mydb

## 安装

```sh
$ npm install --save easy-mydb
```

## 介绍

`Easy-mydb` 封装了一些方法以便于操作[Mysql](https://www.npmjs.com/package/mysql) 

就比如如果使用原来的方式去查询数据的话, 你得这么做

```js
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'db_name'
});
 
connection.connect();
 
connection.query('SELECT * FROM member WHERE uid = 1 AND status = 1', function (error, results, fields) {
  if (error) throw error;
  console.log('The members are: ', results);
});
```
可以看到, 你需要写一些源生的SQL语句. 如果你要从更多的表中查询更多的数据的话, 你要写很多类似于 `SELECT * FROM ... WHERE ...` 这样的SQL语句. 感觉和麻烦, 即使它也做了一些简化, 但感觉还是不够方便.

所以我们对这些操作进行了一系列的封装, 来看看例子.
```js
const EasyMydb = require('easy-mydb');
const config = {
    host: '127.0.0.1'
    , database: 'test'
    , user: 'root'
    , password: '123456'
    , prefix: 'db_'
};
const db = new EasyMydb(config)
// 如果你想用一个实例来只操作user表, 就需要通过model方法来实例化一个实例
const User = db.model('user') //'user' must be a practical table in your schema

async function test () {
    let users = await User.where({uid: 1, status: 1}).select()
    
    // 如果你只是想简单的操作一张数据表
    let user = db.table('user').where({uid: 1, status: 1}).find()
}

test()
User.release()
db.release()
```

后面还会有更多简便操作的介绍, 比如最常见的增删改查

## Connection options
其实 `Easy-mydb` 还是采用 `Mysql` 这个库的方式来链接数据库的, 参数完全一致, 只是新增了一个prefix表前缀参数
常用的参数如下
* `host` 主机. (默认: localhost)
* `port` 端口. (默认: 3306)
* `user` 数据库的用户名.
* `password` 用户密码(*注意: 即使是123456也要用字符串的方式'123456').
* `prefix` 表前缀, 这是新增的参数, 可不填.
* `database` 数据库名.
* `connectionLimit` 最大连接数. (默认: 10).
* ... 更多参数选项可参考 [Mysql](https://www.npmjs.com/package/mysql)

## Query data
* `find` 查询单条数据
* `select` 查询数据集

```js
User.where({id: 1}).find()
```
SQL语句是
```SQL
SELECT * FROM `user` where `id` = 1 LIMIT 1
```
```js
User.where({status: 1}).select()
```
SQL语句是
```SQL
SELECT * FROM `user` where `status` = 1
```

## Insert data
* `insert()` 插入一条数据
* `insertAll()` 插入数据集

```js
let data = {name: 'root', 'age': 1, status: 1}
User.insert(data)
```
```js
let data = [
    {name: 'root', age: 1, status: 1},
    {name: 'admin', age: 1, status: 1},
    //...
]
User.insertAll(data)
```
如果数据量过大, 可以加上limit参数, 来限制每次批量写入的数据个数
```js
let data = [
    {name: 'root', age: 1, status: 1},
    {name: 'admin', age: 1, status: 1},
    //...
]
User.insertAll(data, 100)
```

## Update data
* `update()` 配合`where`方法实现更新操作
* `setField(name, value)` 更新某个字段的值
* `setInc(name, value)` 自增某个字段的值
* `setDec(name, value)` 自减某个字段的值

```js
let data = {name: 'administrator', age: 2}
User.where({id: 1}).update(data)
```
```js
User.where({id: 1}).setField('name', 'UPPER(`name`)')
// update `user` set `name` = upper(`name`) where `id` = 1
```
```js
User.where({id: 1}).setInc('status')
// update `user` set `status` = `status` + 1 where `id` = 1
```
```js
User.where({id: 1}).setDec('age', 2)
// update `user` set `age` = `age` - 2 where `id` = 1
```
我们也能用`update`方法实现上面一样的功能, 像这样
```js
User.where({id: 1}).exp('name', 'UPPER("root")').inc('status').dec('age', 2).update()
```
SQL语句是
```sql
update `user` set `name` = UPPER("root"),`status` = `status` + 1,`age` = `age` - 2 where `id` = 1
```

## Delete data
* `del()` 删除一条数据

```js
User.where({id: 1}).del()
```
如果id是主键, 还可以像下面的方式删除
```js
User.del(1)
```
`id` 必须是主键, 如果不是, 你要用`setPk`方法来指定一个主键
```js
User.setPk('uid')
```
`find`方法也是如此

## 链式操作
- [alias](#alias)
- [distinct](#distinct)
- [fetchSql](#fetchSql)
- [field](#field)
- [group](#group)
- [limit](#limit)
- [mJoin](#mJoin)
- [model](#model)
- [order](#order)
- [page](#page)
- [strict](#strict)
- [table](#table)
- [where](#where)

## alias
`alias` 当前表的别名.

这个方式就是设置表的别名, 基本上都是用来配合`mJoin`方法来进行连表查询操作的
```js
User.alias('u').mJoin('group g', 'u.groupId = g.id').select()
```
执行的SQL语句是
```sql
select * from `user` `u` inner join `group` `g` on `u`.`groupId` = `g`.`id`
```
## distinct
`field` 字段名.

这个方法是用来查询某个字段的唯一的不同值.
```js
User.distinct('name').select()
```
查询结果是
```js
[
	{'name': 'root'},
	{'name': 'admin'}
]
```

## fetchSql
如果你想调试一个操作的SQL语句, 用这个方法可以直接返回SQL语句
```js
User.where({id: 1}).fetchSql().select()
```
返回的结果就是一串SQL语句
```sql
select * from `user` where `id` = 1
```

## field
`name` 字段名.

在某些场景下, 你可能不需要查询所有的字段, 这个方法就是用来筛选字段的.
```js
User.field('id,name').select()
```
你也可以使用`MYSQL`内置的方法
```js
User.field('count(*) as count_result').select()
```
执行的SQL语句是
```sql
select count(*) as count_result from `user`
```

## group
`name` 需要被分组的字段名.

这个方法是用来分组的
```js
User.where({status: 1}).group('gender').select()
```
执行的SQL语句是
```sql
select * from `user` where `status` = 1 group by `gender`
```

## limit
这个方式是限制要查询的数量的

比如只想获取10个用户

```js
User.where({status: 1}).limit(10).select()
```

从第十条开始, 获取十条数据
```js
User.where({status: 1}).limit(10, 10).select()
// or
User.where({status: 1}).limit('10,10').select()
```

## mJoin
`join` 关联的表和表的别称.

`condition` 关联条件.

`type` 连表类型. `inner`,`left`,`right`. 默认是 `inner`

从一张表或多张表中, 通过某个字段相关联, 查询关联的数据

```js
User.alias('u').mJoin('profile p', 'p.uid = u.id', 'left').select()
```
执行的SQL语句是
```sql
select * from `user` `u` left join `profile` `p` on `p`.`uid` = `u`.`id`
```

## model
`name` table name.

用变量来代替一张表, 不需要再用table方法来指明操作哪张数据表
```js
const User = db.model('user')
const Order = db.model('order')
User.find(1)
Order.find(1)
```

## order
`name` 排序的字段名.

`type` 排序类型 `DESC`,`ASC`.

对查询的结果进行排序.
```js
User.order('id', 'DESC').select()
```
你也可以根据多个字段来排序.
```js
User.order('id,status DESC').select()
```

## page
`page` 页码.

`listRow` 每页显示的数据.

`page` 只能用于分页查询.

比如查询第一页, 每页只显示10调数据.
```js
User.page(1, 10).select()
```

## strict
严格模式, 在`update` `insert` `insertAll`这些方法中用到. 一把情况下, 操作的数据对象的键值都是数据库中存在的字段, 如果有些数据的键值不存在于
表中, 那么插入和更新的时候会报错, 需要通过`strict`方法来过滤表中不存在的字段, 这样就能避免报错了. 
```js
let data = {name: 'root', age: 18, gender: 1}
User.strict().insert(data)
```
如果 `gender` 字段不在 `user` 表中, 那么执行的SQL语句就会是这样的
```sql
insert into `user` (`name`, `age`) values ('root', 18)
```

## table
`name` 表名.

指定要操作的数据表.
```js
db.table('user').where({status: 1}).select()
```

## where
`condition` 查询条件.

这个方法很重要, 一般会用在`select`,`update` or `del`等方法上. 而且他的参数有很多写法.

最简单的用法是这样的
```js
User.where({status: 1}).select()
```
或者
```js
User.where('status', 1).select()
```
If you have two or more conditions
```js
User.where({gender: 1, status: 1}).select()
```
或者
```js
User.where([{gender: 1}, {status: 1}]).select()
```
甚至可以这样
```js
User.where({gender: 1}).where({status: 1}).select()
```
这就没了? 并不是.

如果你想模糊查询或者区间查询
```js
User.where({id: {in: [1, 2, 3, 4]}}).select()
User.where({id: {notin: '1,2,3,4'}}).select()
User.where({id: {between: [1, 4]}}).select()
User.where({id: {notbetween: '1,4'}}).select()
User.where({id: {like: '%root%'}}).select()
User.where({id: {notlike: '%root%'}}).select()
```
但是如果你的表中的字段名有 `like`,`in`,`between`这样的关键词字段

我们建议你用如下方式
```js
User.where('between', '1').select()
User.where('in', '1').select()
User.where('like', '1').select()
```
或者加上反引号
```js
User.where({'`between`': 1}).select()
User.where({'`in`': 1}).select()
User.where({'`like`': 1}).select()
```

还有一些高级查询, 请向下看, 找到 '高级查询'

## whereOr
`condition` 查询的条件.

不用我说, 我相信你也知道了这个方法的作用了.

用法和`where`方法一样

## 高级查询
* `whereIn` IN 查询
* `whereNotIn` NOT IN 查询
* `whereNull` 查询字段 IS NULL
* `whereNotNull` 查询字段 IS NOT NULL
* `whereBtw` BETWEEN 查询
* `whereNotBtw` NOT BETWEEN 查询
* `whereLike` LIKE 查询
* `whereNotLike` NOT LIKE 查询
```js
User.whereIn('id', '1,2,3,4').select()
User.whereNotIn('id', '1,2,3,4').select()
User.whereNull('id').select()
User.whereNotNull('id').select()
User.whereBtw('id', [1, 4]).select()
User.whereNotBtw('id', [1, 4]).select()
User.whereLike('id', '%root%').select()
User.whereNotLike('id', '%root%').select()
```

## 聚合查询

在项目中, 我们会经常需要一些统计的数据, `Easy-mydb`也提供了一些简单常用的方法
* `max` 获取最大值, 参数是字段名. (参数必填)
* `min` 获取最小值, 参数是字段名. (参数必填)
* `avg` 获取平均数, 参数是字段名. (参数必填)
* `count` 统计查询的结果, 参数是字段名. (参数选填, 默认是'*')
* `sum` 获取相加的结果, 参数是字段名. (参数必填)

如果在关联操作中有聚合查询
```js
Staff.alias('s').mJoin('group g', 'g.id = s.groupId').count()
```
上述方式会报一个错
```sql
Duplicate column name 'id'
```
所以你需要用`field`方式来指定一个字段, 这样就不会报错了
```js
Staff.alias('s').mJoin('group g', 'g.id = s.groupId').field('s.id').count()
```

## 关键字
* `in/notin` {id: {in/notin: '1,2'}}, id in/notin (1,2)
* `between/notbetween` {id: {between/notbetween: '1,2'}}, id between/notbetween 1 and 2
* `like/notlike` {id: {like/notlike: '%root%'}}, id like/notlike '%root%'
* `gt` {id: {gt: 1}}, id > 1
* `lt` {id: {lt: 1}}, id < 1
* `eq` {id: {eq: 1}}, id = 1
* `neq` {id: {neq: 1}}, id <> 1
* `egt` {id: {egt: 1}}, id >= 1
* `elt` {id: {elt: 1}}, id <= 1

## Release
释放链接
```js
db.release()
User.release()
```
## Destroy
销毁链接
```js
db.destroy()
User.destroy()
```