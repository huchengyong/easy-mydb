const R = require('ramda')

module.exports = (_instance, maps) => {
    let [ field ] = maps
    field = field || ''
    let where = field + ' IS NOT NULL '
    _instance.options.wheres += _instance.options.wheres ? ' AND ' + where : where
}