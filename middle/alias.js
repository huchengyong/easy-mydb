module.exports = (_instance, maps) => {
    const [ s ] = maps
    _instance.options.aliasStr = ` AS ${s} `
}