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

async function test()
{
	let a = await 
	Group.where({id:{lt:10}})
	.where({groupName: {like: 'Hu%'}})
	.whereIn('id','5,6,7')
	.whereNotNull('id')
	.order('id', 'asc')
	// .fetchSql()
	.limit(0,10)
	.select()
	console.log(a)
}
test()