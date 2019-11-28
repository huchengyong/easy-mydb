const EasyMydb = require('./index')
const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
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
        .field('u.groupId,u.userName,u.id,g.groupName,g.rules,g.parentId')
        // .distinct('u.id')
        // .whereOr([{'g.id': {notin: '1,2'}}, {'g.id': {notbetween: [1,3]}}, {'g.groupName': {notlike: 'Hu%'}}])
        // .fetchSql()
        // .where('u.id', '=', 5)
        // .where({'u.id': 5})
        // .where('u.userName', 'Hu')
        .where('u.username = "Hu"')
        .whereOr('u.id = 1')
        .whereOr('u.id', '<>', 3)
        .where({groupName: 'groupname'})
        .where('u.groupId', '>', 67)
        .whereOr({'u.groupId':{egt: 69}})
        .whereNotLike({'g.groupName': '%groupname%'})
        .whereNotBtw({'u.id': [1,7]})
        .whereNotIn('u.id', '1,2,3,4,5')
        .whereNotNull('g.groupName')
        .group('u.userName')
        // .order('u.id', 'desc')
        .select('u.id')

	    console.log(res)
}

test()
