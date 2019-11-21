# easy-mydb

## Install

```sh
$ npm install --save easy-mydb
```

## Introduction

`Easy-mydb` encapsulate some methods of [Mysql](https://www.npmjs.com/package/mysql) to use more convenient

If you want to query the data in the original way, you can do that like following example.

```js
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
As you can see, you need to write native sql by your self. If you want to query more data from different table, you have
to write more native sql like `SELECT * FROM ... WHERE ...`. It's very redundant and inconvenient.

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

db.release()

```

## select
This method can query all data.

For example

```js
//We can use 'where' method to filter some data
db.table('user').where({id:1}).select() //you will get a Promise object
```

## insert
This method can insert one data to table

```js
db.table('user').insert({id:1,name:'root'});
//insert into user (id,name) value (1,'root');
```

## insertAll

```js
db.table('user').insertAll([{id:1,name:'root'},{id:2,name:'admin'}])
```

## update

```js
db.table('user').where({id:1}).update({name:'root1'});
// update user set name=root where id = 1;
```

## delete

```js
db.table('user').where({id:1}).delete();
//Or
db.table('user').delete(1); //v2.2.0 Fix known bugs
// 1 must be primary key, if the table primary key is not 'id', you can use
// db.setPrimaryKey('uid') method
```

## find
This method can query one data

```js
db.table('user').where({id:1}).find()
//or
db.table('user').find(1) // select * from user where id = 1 limit 1
// or
db.setPrimaryKey('uid')
db.table('user').find(1) // select * from user where uid = 1 limit 1
// param must be primary key
```

## query
We can use native SQL with this method
```js
db.query('select * from user') // you will get a Promise object
```

## count
```js
db.table('user').count() //select count(*) from user
```

## sum
```js
db.table('user').sum('age') //select sum(age) from user
```

## max
```js
db.table('user').max('id') //select max(id) from user
```

## min
```js
db.table('user').min('id') //select min(id) from user
```

## avg
```js
db.table('user').avg('age') //select avg(age) from user
```

## setInc
```js
db.table('user').where({id:1}).setInc('age') //update `user`  set `age` = `age` + 1  where  `id` = 1
db.table('user').where({id:1}).setInc('age',2) //update `user`  set `age` = `age` + 2  where  `id` = 1 
```

## setDec
```js
db.table('user').where({id:1}).setDec('age') //update `user`  set `age` = `age` - 1  where  `id` = 1
db.table('user').where({id:1}).setDec('age',2) //update `user`  set `age` = `age` - 2  where  `id` = 1
```

## setField
```js
db.table('user').where({id:1}).setField('age','24') //update user set age = 24 where id = 1
```

## where
This method can filter some data

```js
db.table('user').where({id:1,name:'root'}).select() //where id = 1 and name = 'root'

db.table('user').where({id:{gt:1},name:'root'}).select() //where id > 1 and name = 'root'
// ['gt'=>'>','lt'=>'<','eq'=>'=','egt'=>'>=','elt'=>'<=']

db.table('user').where({name:{like:'%root%'}}).select() // where name like '%root%'
//or
db.table('user').whereLike({name:'%root%'}).select()

db.table('user').where({id:{in:[1,2,3,4]}}).select() // where id in 1,2,3,4
//or
db.table('user').whereIn({id:[1,2,3,4]}).select()

db.table('user').where({id:{between:[1,4]}}).select() // where id between 1 and 4
//or
db.table('user').whereBtw({id:[1,4]}).select()
```
## whereOr
similar with where method

## field
This method can filter some fields
```js
db.table('user').field('id,name').select() // select id,name from user
```

## order
```js
db.table('user').order({id:'desc'}).select() //select * from user order by id desc
```

## group
```js
db.table('user').group('id').select() // select * from user group by id
```

## limit

```js
db.table('user').limit(0,10).select() //select * from user limit 0,10
```

## page
```js
db.table('user').page(1,10).select() //select * from user limit 0,10
db.table('user').page(2,10).select() //select * from user limit 10,10
db.table('user').page(3,10).select() //select * from user limit 20,10
```

## distinct
```js
db.table('user').distinct('name').select() //select distinct name from user;
```

## alias&mJoin
```js
db.table('user').alias('u').join('profile p', 'p.uid=u.id').where({'u.id':1}).select()
//select * from user u inner join profile p on p.uid=u.id where u.id = 1
db.table('user').alias('u').join('profile p', 'p.uid=u.id', 'inner'|'left'|'right').select()
//select * from user u inner|left|right join profile p on p.uid=u.id
```

## dec
```js
db.table('user').dec('age').where({id: 1}).update() // update user set age = age - 1 where id = 1
db.table('user').dec('age', 3).where({id: 1}).update() // update user set age = age - 3 where id = 1
db.table('user').dec({age: 3, sex: 2}).where({id: 1}).update() // update user set age = age - 3,sex = sex - 2 where id = 1
```

## inc
```js
db.table('user').inc('age').where({id: 1}).update() // update user set age = age + 1 where id = 1
db.table('user').inc('age', 3).where({id: 1}).update() // update user set age = age + 3 where id = 1
db.table('user').inc({age: 3, sex: 2}).where({id: 1}).update() // update user set age = age + 3,sex = sex + 2 where id = 1
```

## exp
```js
db.table('user').exp('name', 'root').where({id: 1}).update()
// update user set name = 'root' where id = 1
db.table('user').exp({name: 'UPPER(root)'}).where({id: 1}).update()
// update user set name = UPPER('root') where id = 1
```

## release
After use, you must use the release() method to release resource
```js
db.release()
```