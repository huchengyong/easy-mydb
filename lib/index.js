const dealData = require('./dealData')
const dealObject = require('./dealObject')
const inColumns = require('./inColumns')
const isKeyWord = require('./isKeyWord')
const strToExp = require('./strToExp')
const setColumns = require('./setColumns')
const setUpdate = require('./setUpdate')

module.exports = {
    dealData: (mysql) => dealData(mysql),
    dealObject: (mysql, condition, conjunction) => dealObject(mysql, condition, conjunction),
    isKeyWord: (key) => isKeyWord(key),
    inColumns: (key) => inColumns(key),
    setColumns: () => setColumns(),
    setUpdate: () => setUpdate(),
    strToExp: (string) => strToExp(string),
}