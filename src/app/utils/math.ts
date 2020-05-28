export function* makeRangeIterator(start: number, end: number, step: number) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

export function iterateFunction(f: (x: number) => number, x: number, n: number) {
    var result = [{x: x, y: 0}];

    var x0 = x;
    for (var i = 0; i < n; ++i) {
        let y = f(x0);
        result.push({x: x0, y: y});
        result.push({x: y, y: y});
        x0 = y;
    }

    return result;
}
