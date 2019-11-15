const R = require('ramda')
module.exports = (_instance, maps) => {
    const [ field ] = maps
    if (typeof field === 'string' && field != '') {
        let distinct = R.replace(/,/g)('`,`')(field)
        distinct = !distinct ? '`' + distinct + '`' : ''
        _instance.options.distincts = ' DISTINCT ' + distinct;
    }
}