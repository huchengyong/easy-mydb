const dealData = require('./dealData')
const dealObject = require('./dealObject')
const inColumns = require('./inColumns')
const isKeyWord = require('./isKeyWord')
const strToExp = require('./strToExp')
const setColumns = require('./setColumns')
const setUpdate = require('./setUpdate')

module.exports = {
    dealData: (mysql, data) => dealData(mysql, data),
    dealObject: (mysql, condition, conjunction) => dealObject(mysql, condition, conjunction),
    isKeyWord: (key) => isKeyWord(key),
    inColumns: (mysql, key) => inColumns(mysql, key),
    setColumns: (mysql) => setColumns(mysql),
    setUpdate: (mysql) => setUpdate(mysql),
    strToExp: (string) => strToExp(string),
}