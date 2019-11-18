const R = require('ramda')
function dealData(_instance, data) {
    if (typeof data === 'object') {
        for (let k in data) {
            let v = data[k];
            if (typeof v === 'object') {
                dealData(_instance, v);
            } else {
                if (_instance.allowField == true && R.indexOf(k)(_instance.columns) == -1) continue
                let field = '`' + k + '`';
                let value = '\'' + v + '\'';
                _instance.options.insertFields += _instance.options.insertFields == '' ? field : (',' + field)
                _instance.options.insertValues += _instance.options.insertValues == '' ? value : (',' + value)
            }
        }
    }
}

module.exports = (...maps) => {
    const [ _instance, data ] = maps
    dealData(_instance, data)
}