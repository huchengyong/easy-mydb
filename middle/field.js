module.exports = (_instance, maps) => {
    const [ fields ] = maps
    _instance.options.fields = fields || '*'
}