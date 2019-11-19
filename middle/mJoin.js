module.exports = (_instance, maps) => {
    const [ table, op, method, isPrefix ] = maps
    const m = method ? method.toUpperCase() : 'INNER'

    const newTable = isPrefix === false ? table : (_instance.dbConfig.prefix + table)
    _instance.options.joinStr = ` ${m} JOIN ${newTable} ON ${op} `
}