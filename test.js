const EasyMydb = require('./index')
const config = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bearly.cn',
    prefix: 'ely_'
}
const db = new EasyMydb(config)
const Group = db.model('group')
const Menu = db.model('menu')
const Staff = db.model('staff')

async function test() {
    let res = await Staff.alias('u')
        .mJoin('group g', 'g.id = u.groupId')
        .field('u.groupId,u.userName,g.id,g.groupName')
        .whereOr([{'g.id': {notin: '1,2'}}, {'g.id': {notbetween: [1,3]}}, {'g.groupName': {notlike: 'Hu%'}}])
        // .fetchSql()
        .group('u.userName')
        .select()

    console.log(res)
    // for (let $i = 0; $i < 10; $i++)
    // {
    // 	console.log(await Menu.field('id').find($i+1))
    // }

    // let a = await
    // Group.where({id:{lt:10}})
    // .where({groupName: {like: 'Hu%'}})
    // .whereIn('id','5,6,7')
    // .whereNotNull('id')
    // .order('id', 'asc')
    // // .fetchSql()
    // .limit(0,10)
    // .select()
    // console.log(a)
}

test()
