module.exports = (_instance, maps) => {
    const [ start, offset ] = maps
    if (offset) {
        _instance.options.limits = start + ',' + offset;
    } else {
        _instance.options.limits = start;
    }
}