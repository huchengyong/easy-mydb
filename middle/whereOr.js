module.exports = (_instance, maps) => {
    const [ field, op, condition ] = maps
    _instance.where(field, op, condition, 'OR')
}