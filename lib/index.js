const R = require('ramda')
const libArr = ['dealData', 'dealObject', 'isKeyWord', 'strToExp', 'setColumns', 'setUpdate']

let libs = {}
R.forEach(val => {
    libs[val] = require(`./${val}`)
})(libArr)

R.forEachObjIndexed((val, key) => {
    exports[key] = (...maps) => {
    	console.log(maps)
        val(maps)
    }
})(libs)