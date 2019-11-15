const R = require('ramda')
module.exports = (_instance, maps) => {
	const [ field ] = maps
    if (typeof field === 'string' && field != '') {
        let groups = R.replace(/,/g)('`,`')(field)
        groups = !R.isEmpty(groups) ? '`' + groups + '`' : ''
        groups = R.replace(/\./g)('`.`')(groups)

        _instance.options.groups = ' GROUP BY ' + groups
    }
}