const R = require('ramda')
module.exports = (_instance, maps) => {
    let [ field, order ] = maps
    if (order) {
        if (typeof order === 'object') {
            for (let k in order) {
                let v = order[k]
                _instance.order(k, v)
            }
        } else if (typeof order === 'string') {
            let orders = `\`${R.replace('.')('`.`')(field)} ${R.toUpper(order)}\``
            _instance.options.orders += !_instance.options.orders ? ',' + orders : orders
        }
    } else {
        if (typeof field === 'object') {
            for (let k in field) {
                let v = field[k]
                _instance.order(k, v)
            }
        } else {
            _instance.options.orders += !_instance.options.orders ? ',' + field : field
        }
    }
}