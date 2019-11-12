module.exports = (_instance, maps) => {
    const [p, offset] = maps

    let page = p > 1 ? p : 1
    let start = (page - 1) * (offset || 0)

    if (offset) {
        _instance.options.limits = start + ',' + offset;
    } else {
        _instance.options.limits = start;
    }
}