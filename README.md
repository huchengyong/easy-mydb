# easy-mydb

## Install

```sh
$ npm install --save easy-mydb
```

## Introduction

`Easy-mydb` encapsulate some methods of [Mysql](https://www.npmjs.com/package/mysql) to use more convenient

If you want to query the data in the original way, you can do that like following example.

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
As you can see, you need to write native SQL statement by your self. If you want to query more data from different table, you have
to write more native SQL statement like `SELECT * FROM ... WHERE ...`. It's very redundant and inconvenient.

So how can we operate mysql table more convenient ? let's see following example.
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
//if you want a instance to operate table `User` only, you can use method 'model' to get a `User` instance of EasyMydb
const User = db.model('user') //'user' must be a practical table in your schema

async function test () {
    let users = await User.where({uid: 1, status: 1}).select()
    
    // if you want to operate table directly rather than get a instance first.
    let user = db.table('user').where({uid: 1, status: 1}).find()
}

test()
User.release()
db.release()
```

## Connection options
We use `createPool` method to connect `mysql`, the options are same as mysql's options.
The most common options are
* `host` The hostname of the database you are connecting to. (Default: localhost)
* `port` The port number to connect to. (Default: 3306)
* `user`  The MySQL user to authenticate as.
* `password` The password of that MySQL user.
* `database` Name of the database to use for this connection (Optional).
* `connectionLimit` The maximum number of connections to create at once. (Default: 10).
* ... more options you can see on [Mysql](https://www.npmjs.com/package/mysql)

## Query data
* `find` query single data
* `select` query multiple data

```js
User.where({id: 1}).find()
```
The resulting SQL statement may be
```SQL
SELECT * FROM `user` where `id` = 1 LIMIT 1
```
```js
User.where({status: 1}).select()
```
The resulting SQL statement may be
```SQL
SELECT * FROM `user` where `status` = 1
```

## Insert data
* `insert()` insert single data
* `insertAll()` insert multiple data

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
If the data is to large, you can add a second parameter to specify the number limit for each insert.
```js
let data = [
    {name: 'root', age: 1, status: 1},
    {name: 'admin', age: 1, status: 1},
    //...
]
User.insertAll(data, 100)
```

## Update data
* `update()` do update with `where` method
* `setField(name, value)` update single field's value
* `setInc(name, value)` increment the field's value
* `setDec(name, value)` decrement the field's value

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
We can use `update` method to achieve the same effect like `setField`,`setInc`,`setDec`.
Look at following example
```js
User.where({id: 1}).exp('name', 'UPPER("root")').inc('status').dec('age', 2).update()
```
The resulting SQL statement may be
```sql
update `user` set `name` = UPPER("root"),`status` = `status` + 1,`age` = `age` - 2 where `id` = 1
```

## Delete data
* `del()` delete data from database's table

```js
User.where({id: 1}).del()
```
You can alse use `del` method more simpler
```js
User.del(1)
```
`id` must be table's primary key, if not, you can also use `setPk` method to specify the primary key
```js
User.setPk('uid')
```
Same as `find` method

## Chained operations
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
- [table](#table)
- [where](#where)

## alias
* `alias` alias of the current data table.

Alias is used to set the alias of the current data table, which is convinient to use other chained operations such as method `mJoin`. Because the `join` is a build-in method of JavaScript, so we use `mJoin` instead. 
```js
User.alias('u').mJoin('group g', 'u.groupId = g.id').select()
```
The resulting SQL statement will be
```sql
select * from `user` `u` inner join `group` `g` on `u`.`groupId` = `g`.`id`
```
## distinct
* `field` field's name of data table which you want unique.

Distinct method is used to return a unique different value.
```js
User.distinct('name').select()
```
The data returned will be
```js
[
	{'name': 'root'},
	{'name': 'admin'}
]
```

## fetchSql
If the result of query which you want to is only the resulting SQL statement, `fetchSql` can help you.
```js
User.where({id: 1}).select()
```
The returned result is not a dataset, but a string of SQL statements.
```sql
select * from `user` where `id` = 1
```

## field
* `name` the field's names you want to keep.

In some cases, you don't need all the fields, and the `field` method keeps the fields you want to keep.
```js
User.field('id,name').select()
```
You can even use some MYSQL functions, just like
```js
User.field('count(*) as count_result').select()
```
The resulting SQL statement will be
```sql
select count(*) as count_result from `user`
```

## group
* `name` field name to be grouped.

Group dataset based on one or more fields, if you want to group by gender
```js
User.where({status: 1}).group('gender').select()
```
The resulting SQL statement will be
```sql
select * from `user` where `status` = 1 group by `gender`
```

## limit
Limit method mainly used to specify the number of queries.

Get 10 eligible users

```js
User.where({status: 1}).limit(10).select()
```

Get 10 users from 10
```js
User.where({status: 1}).limit(10, 10).select()
// or
User.where({status: 1}).limit('10,10').select()
```

## mJoin
* `join` table name and alias to associate.
* `condition` association condition.
* `type` association type. `inner`,`left`,`right`
Queries data from two or more tables based on the relationship between the columns in those tables.

For example
```js
User.alias('u').join('profile p', 'p.uid = u.id', 'left').select()
```
The resulting SQL statement will be
```sql
select * from `user` `u` left join `profile` `p` on `p`.`uid` = `u`.`id`
```

## model
* `name` table name.
Replace a table with a veriable, we don't need `table` method to specify a table to be operated on.
```js
const User = db.model('user')
const Order = db.model('order')
User.find(1)
Order.find(1)
```

## order
* `name` field's name.
* `type` order type `DESC`,'ASC'.
Sorting the results of a query.
```js
User.order('id', 'DESC').select()
```
Also you can order by two or more fields.
```js
User.order('id,status DESC').select()
```

## page
* `page` pagination.
* `listRow` number of data to be queried per page.
The `page` method can only be used for paging queries.

Query the data on the first page, and ten data per page.
```js
User.page(1, 10).select()
```


## table
* `name` table's name.
Specify a table to be operated on.
```js
db.table('user').where({status: 1}).select()
```

## where
* `condition` conditions for querying data.
The `where` method is very important, it can be used in `select`,`update` or `del` methods, and it has many uses.

Thie simplest use
```js
User.where({status: 1}).select()
```
or
```js
User.where('status', 1).select()
```
If you have two or more conditions
```js
User.where({gender: 1, status: 1}).select()
```
or
```js
User.where([{gender: 1}, {status: 1}]).select()
```
can even
```js
User.where({gender: 1}).where({status: 1}).select()
```
Is that all ? No.

If you want to fuzzy query or interval query, you can do that like
```js
User.where({id: {in: [1, 2, 3, 4]}}).select()
```
or
```js
User.where('id', 'in', [1, 2, 3, 4]).select()
```
The resulting SQL statement will be
```sql
select * from `user` where `id` in (1,2,3,4)
```
Same as `whereIn` method, what's `whereIn`? Please see [AdvancedQuery](#AdvancedQuery)

## whereOr
* `condition` conditions for querying data.

Needless to say, I believe you already know what this method is for.

Same as `where` method.

## AdvanceQuery
* `whereIn` where field in
* `whereNotIn` where field not in
* `whereNull` whether the query field is null
* `whereNotNull` whether the query field is not null
* `whereBtw` where field between
* `whereNotBtw` where field not between
* `whereLike` where field like
* `whereNotLike` where field not like


## release
After use, you must use the `release` method to release resource
```js
db.release()
```