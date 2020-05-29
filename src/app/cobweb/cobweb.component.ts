import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as math from 'mathjs'
import * as chart from 'chart.js'
import * as utils from './../utils/math.js';

@Component({
  selector: 'app-cobweb',
  templateUrl: './cobweb.component.html',
  styleUrls: ['./cobweb.component.css']
})
export class CobwebComponent implements OnInit {

  @ViewChild('xy') xy;

  private _func: math.EvalFunction;
  @Input() set func(func: math.EvalFunction) {
    this._func = func;
    this.draw();
  }

  get func(): math.EvalFunction {
    return this._func;
  }

  chart: chart.Chart;
  context: CanvasRenderingContext2D;

  x: number = 0.2;
  a: number = 2.2;
  xMin: number = 0;
  xMax: number = 2;
  skip: number = 0;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let canvas = this.xy.nativeElement;
    this.context = canvas.getContext('2d');
    this.draw();
  }

  getF(): (x: number) => number {
    let f = (x: number) => this.func.evaluate({ x: x, a: this.a });
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

  onSkip(x?: number): void {
    if (x != null && this.skip !== x) {
      this.skip = x;
      this.draw();
    }
  }

  draw(): void {
    if (this.context && this.func) {
      let f = this.getF();

      let points = utils.iterateFunction(f, this.x, this.skip, 100);

      const minReducer = (accumulator: number, currentValue) => Math.min(accumulator, currentValue);
      const maxReducer = (accumulator: number, currentValue) => Math.max(accumulator, currentValue);
      let lower = points.reduce(minReducer, this.xMin);
      let upper = points.reduce(maxReducer, this.xMax);

      let dx = (upper - lower) / 100;
      const it = utils.makeRangeIterator(lower, upper + dx, dx);

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
            label: 'function',
            data: data,
            yAxisID: 'y',
            borderColor: 'rgba(255, 0, 0, 255)',
            pointRadius: 0
          }, {
            label: 'identity',
            data: identity,
            yAxisID: 'y',
            borderColor: 'rgba(0, 255, 0, 255)',
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
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom'
            }],
            yAxes: [{
              id: 'y',
              type: 'linear',
              position: 'left'
            }]
          }
        }
      });
      this.chart.resize();
    }
  }

}
