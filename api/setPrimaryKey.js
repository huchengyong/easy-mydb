module.exports = (_instance, maps) => {
	const [ primaryKey ] = maps
    _instance.primaryKey = primaryKey ?: 'id'
}