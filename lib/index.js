const R = require('ramda')
const libArr = ['dealData', 'dealObject', 'isKeyWord', 'strToExp', 'setColumns']

let libs = {}
R.forEach(val => {
    libs[val] = require(`./${val}`)
})(libArr)

R.forEachObjIndexed((val, key) => {
    exports[key] = (...maps) => {
        val(maps)
    }
})(libs)