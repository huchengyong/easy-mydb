# easy-mydb

## Table of contents

- [Install](#install)
- [Introduction](#introduction)
- [select](#select)
- [insert](#insert)
- [insertAll](#insertAll)
- [update](#update)
- [delete](#delete)
- [find](#find)
- [query](#query)
- [count](#count)
- [sum](#sum)
- [max](#max)
- [min](#min)
- [avg](#avg)
- [where](#where)
- [whereOr](#whereOr)
- [field](#field)
- [order](#order)
- [group](#group)
- [limit](#limit)
- [distinct](#distinct)
- [alias&mJoin](#alias&mJoin)
- [release](#release)

## Install

```sh
$ npm install --save easy-mydb
```

## Introduction

We can use [Mysql](https://www.npmjs.com/package/mysql) more easily

Here is an example on how to use it

```js
var Db = require('easy-mydb');
var config = {
    host: '127.0.0.1'
    , database: 'test'
    , user: 'root'
    , password: '123456'
    , prefix: 'db_'
};
var db = new Db()

db.connect(config)

var allUser = db.table('user').select() // The sql is 'select * from `db_user`'

var user = db.table('user').find(1)

allUser.then((data) => {
    console.log(data) // [{id:1,name:root}, {id:2,name:admin}]
})

async function test() {
    var user = await db.table('user').find(1);
    console.log(user)
}
test() // {id:1,name:root}

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
db.table('user').insertAll([{id:1,username:'root'},{id:2,username:'admin'}])
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
db.table('user').delete(1);
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
db.table('user').query('select * from user') // you will get a Promise object
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

## distinct

```js
db.table('user').distinct('name').select() //select distinct name from user;
```

## alias&mJoin
```js
db.table('user').alias('u').join('profile p', 'p.uid=u.id').select()
//select * from user u inner join profile p on p.uid=u.id
db.table('user').alias('u').join('profile p', 'p.uid=u.id', 'inner'|'left'|'right').select()
//select * from user u inner|left|right join profile p on p.uid=u.id
```

## release
After use, you muse use the release() method to release resource
```js
db.release()
```