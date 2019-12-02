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

function randstr() {
    let words = 'abcdefghijklmnopqrstuvwxyz'
    let string = ''
    for (let i = 0; i < 6; i++) {
        string += words.substr(Math.round(Math.random() * (words.length-1)), 1)
    }
    return string
}

async function test() {
    let res  = await Group.order('id', 'asc').page(3,5).select();
    console.log(res)
}

test()
