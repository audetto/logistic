import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as chart from 'chart.js'
import * as utils from './../utils/math.js';

type func_t = (a: number, x: number) => number;

@Component({
  selector: 'app-cobweb',
  templateUrl: './cobweb.component.html',
  styleUrls: ['./cobweb.component.css']
})
export class CobwebComponent implements OnInit {

  @ViewChild('xy') xy;

  private _func: func_t;
  @Input() set func(func: func_t) {
    this._func = func;
    this.draw();
  }

  get func(): func_t {
    return this._func;
  }

  chart: chart;
  context: CanvasRenderingContext2D;

  x: number = 0.2;
  a: number = 3.0;
  xMin: number = 0;
  xMax: number = 1;
  skip: number = 0;
  iterations: number = 100;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let canvas = this.xy.nativeElement;
    this.context = canvas.getContext('2d');
    this.draw();
  }

  getF(): (x: number) => number {
    let f = (x: number) => this.func(this.a, x);
    return f;
  }

  onA(a?: number): void {
    if (a != null && this.a !== a) {
      this.a = a;
      this.draw();
    }
  }

  onX(x?: number): void {
    if (x != null && this.x !== x) {
      this.x = x;
      this.draw();
    }
  }

  onMax(x?: number): void {
    if (x != null && this.xMax !== x) {
      this.xMax = x;
      this.draw();
    }
  }

  onMin(x?: number): void {
    if (x != null && this.xMin !== x) {
      this.xMin = x;
      this.draw();
    }
  }

  onSkip(skip?: number): void {
    if (skip != null && this.skip !== skip) {
      this.skip = skip;
      this.draw();
    }
  }

  onIterations(iterations?: number): void {
    if (iterations != null && this.iterations !== iterations) {
      this.iterations = iterations;
      this.draw();
    }
  }

  onClick?(event?: MouseEvent, activeElements?: Array<{}>): any {
    const chart = this.chart;
    const relX = (event.offsetX - chart.chartArea.left) / (chart.chartArea.right - chart.chartArea.left);
    // type information seems to be missing here
    const axis = chart['scales'].x;

    const x = axis.min + relX * (axis.max - axis.min);
    this.onX(x);
  }

  draw(): void {
    if (this.context && this.func) {
      let f = this.getF();

      let points = utils.iterateFunction(f, this.x, this.skip, this.iterations);

      const minReducer = (accumulator: number, currentValue: number) => Math.min(accumulator, currentValue);
      const maxReducer = (accumulator: number, currentValue: number) => Math.max(accumulator, currentValue);
      let lower = points.reduce(minReducer, this.xMin);
      let upper = points.reduce(maxReducer, this.xMax);

      let dx = (upper - lower) / 100;
      const it = utils.makeRangeIterator(lower, upper, dx);

      let xs = Array.from(it);
      let data = xs.map(x => ({ x: x, y: f(x) }));
      let identity = xs.map(x => ({ x: x, y: x }));

      let web = utils.createPath(points);

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new chart.Chart(this.context, {
        type: 'line',
        data: {
          datasets: [{
            label: 'identity',
            data: identity,
            yAxisID: 'y',
            borderColor: 'rgba(0, 255, 0, 255)',
            pointRadius: 0
          }, {
            label: 'function',
            data: data,
            yAxisID: 'y',
            borderColor: 'rgba(255, 0, 0, 255)',
            pointRadius: 0
          }, {
            label: 'iterates',
            data: web,
            cubicInterpolationMode: 'monotone',
            yAxisID: 'y',
            borderColor: 'rgba(0, 0, 255, 255)'
          }]
        },
        options: {
          animation: null,
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              id: 'x',
              type: 'linear',
              position: 'bottom'
            }],
            yAxes: [{
              id: 'y',
              type: 'linear',
              position: 'left'
            }]
          },
          onClick: (event?: MouseEvent, activeElements?: Array<{}>) => this.onClick(event, activeElements)
        }
      });
      this.chart.resize();
    }
  }

}
