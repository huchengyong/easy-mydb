module.exports = (_instance, maps) => {
    const [ pk ] = maps
    if (pk) {
        let where = {}
        where[_instance.primaryKey] = pk
        _instance.where(where).limit(1)
    } else {
        _instance.limit(1)
    }
    return _instance.select().then((data) => {
        return data && data.length > 0 ? data[0] : {}
    })
}