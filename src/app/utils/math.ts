export function* makeRangeIterator(start: number, end: number, step: number) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

export function iterateFunction(f: (x: number) => number, x: number, skip: number, n: number) {
    var x0 = x;
    for (var i = 0; i < skip; ++i) {
        x0 = f(x0);
    }

    var result = [{x: x0, y: 0}];

    for (var i = 0; i < n; ++i) {
        let y = f(x0);
        result.push({x: x0, y: y});
        result.push({x: y, y: y});
        x0 = y;
    }

    return result;
}
