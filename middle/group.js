const R = require('ramda')
module.exports = (_instance, maps) => {
	const [ field ] = maps
    if (typeof field === 'string' && field != '') {
        let groups = R.replace(',')('`,`')(field)
        groups = !groups ? '`' + groups + '`' : ''
        groups = R.replace('.')('`.`')(groups)

        _instance.options.groups = ' GROUP BY ' + groups
    }
}