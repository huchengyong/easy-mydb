module.exports = (_instance, maps) => {
    const [ table, op, method ] = maps
    let m = method ? method.toUpperCase() : 'INNER'
    _instance.options.joinStr = ` ${m} JOIN ${table} ON ${op} `
}