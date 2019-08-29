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
- [where](#where)
- [whereOr](#whereOr)
- [field](#field)
- [order](#order)
- [group](#group)
- [limit](#limit)
- [distinct](#distinct)
- [query](#query)

## Install

```sh
$ npm install --save easy-mydb
```

## Introduction

We can use [Mysql](https://www.npmjs.com/package/mysql) more easily

Here is an example on how to use it

```js
var db = require('easy-mydb');
var config = {
    host: '127.0.0.1'
    , database: 'test'
    , user: 'root'
    , password: '123456'
};
var User = new db('user',config);
```

## select
This method can query all data.

For example

```js
//We can use 'where' method to filter some data
User.where({id:1}).select().then((data) => {
    console.log(data);
    //[{id:1,username:root,age:18:sex:1}]
})
```

## insert
This method can insert one data to database

```js
User.insert({id:1,username:'root',age:1,sex:1});
//insert into user (id,username,age,sex) value (1,'root',1,1);
```

## insertAll

```js
User.insertAll([{id:1,username:'root',age:1,sex:1},{id:2,username:'admin',age:1,sex:1}])
```

## update

```js
User.where({id:1}).update({username:'root',age:2});
// update user set username=root,age=2 where id = 1;
```

## delete

```js
User.where({id:1}).delete();
//Or
User.delete(1);
// 1 must be primary key
```

## find
This method can query one data

```js
User.where({id:1}).find();
//or
User.find(1);
// param must be primary key
```

## where
This method can filter some data

```js
User.where({id:1,username:'root'}).select(); //where id = 1 and username = 'root'

User.where({id:{gt:1},username:'root'}).select(); //where id > 1 and username = 'root'
// ['gt'=>'>','lt'=>'<','eq'=>'=','egt'=>'>=','elt'=>'<=']

User.where({username:{like:'%root%'}}).select(); // where username like '%root%'
//or
User.whereLike({username:'%root%'}).select();

User.where({id:{in:[1,2,3,4]}}).select(); // where id in 1,2,3,4
//or
User.whereIn({id:[1,2,3,4]}).select();

User.where({id:{between:[1,4]}}).select(); // where id between 1 and 4
//or
User.whereBtw({id:[1,4]}).select();
```
## whereOr
similar with where method

## field
This method can filter some fields
```js
User.field('id,username').select(); // select id,username from user
```

## order

```js
User.order({id:'desc'}).select(); //select * from user order by id desc
```

## group

```js
User.group('id').select(); // select * from user group by id
```

## limit

```js
User.limit(0,10).select(); //select * from user limit 0,10
```

## distinct

```js
User.distinct('username').select(); //select distinct username from user;
```

## query
We can use native SQL with this method
```js
User.query('select * from user').then((data) => {
    
});
```