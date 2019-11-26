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

async function test()
{
	let res = await Staff.alias('u')
	.mJoin('group g', 'g.id = u.groupId')
	.field('u.groupId,u.userName,g.id,g.groupName')
	.whereNotIn('g.id','1,2,3,4,5')
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
