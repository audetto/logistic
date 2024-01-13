import { Point } from 'chart.js/auto'

export function* makeRangeIterator(start: number, end: number, step: number) {
  for (let i = start; i < end; i += step) {
      yield i;
  }
}

export function iterateFunction(f: (x: number) => number, x: number, skip: number, n: number): number[] {
  let x0 = x;
  for (let i = 0; i < skip; ++i) {
      x0 = f(x0);
  }

  const result = [x0];

  for (let i = 0; i < n; ++i) {
      x0 = f(x0);
      result.push(x0);
  }

  return result;
}

export function getLyapunov(d: (x: number) => number, xs: number[]): number {
    let lyapunov = 0.0;
    
    for (const x of xs) {
        const val = d(x);
        lyapunov += Math.log(Math.abs(val));
    }

    const res = lyapunov / xs.length;
  
    return res;
}
  
export function iterateFunction2(f: (x: number) => number, x: number, skip: number, n: number, dx: number): number[] {
  let x0 = x;
  for (let i = 0; i < skip; ++i) {
      x0 = f(x0);
  }

  // const corridor = (x: number, k: number): number => -Math.max(-k - x, 0) + Math.max(x - k, 0);

  const equals = (a: number, b: number): Boolean => Math.abs(a - b) < dx;
  // const compare = (a: number, b: number): number => corridor(a - b, dx);

  const points: number[] = [];

  for (let i = 0; i < n; ++i) {
      let y = f(x0);
      const check = (element: number) => equals(element, y);

      if (points.some(check)) {
          break;
      } else {
          points.push(y);
          x0 = y;
      }
  }

  return points;
}

export function createPath(points: Array<number>): Point[] {
  let x = points[0];
  const result = [];
  for (const point of points) {
      // skip first
      const y = point;
      if (result.length == 0) {
          result.push({x: x, y: 0});
      } else {
          result.push({x: x, y: y});
          result.push({x: y, y: y});
      }
      x = y;
  }
  return result;
}
