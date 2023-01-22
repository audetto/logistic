import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Chart, ActiveElement, ChartEvent } from 'chart.js/auto'
import * as utils from '../utils/math';
import { FunctionAX } from '../function/function.component'


@Component({
  selector: 'app-cobweb',
  templateUrl: './cobweb.component.html',
  styleUrls: ['./cobweb.component.css']
})
export class CobwebComponent implements OnInit {

  @ViewChild('xy') xy : any;

  private _func!: FunctionAX;
  @Input() set func(f: FunctionAX) {
    this._func = f;
    this.draw();
  }

  chart?: Chart;
  context?: CanvasRenderingContext2D;

  x: number = 0.2;
  a: number = 3.0;
  xMin: number = 0;
  xMax: number = 1;
  skip: number = 0;
  iterations: number = 100;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const canvas = this.xy.nativeElement;
    this.context = canvas.getContext('2d');
    this.draw();
  }

  getF(): (x: number) => number {
    const f = (x: number) => this._func(this.a, x);
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

  onClick(event: ChartEvent, elements: ActiveElement[], chart: Chart): void {
    if (event.x && event.y) {
      const relX = (event.x - chart.chartArea.left) / (chart.chartArea.right - chart.chartArea.left);
      // type information seems to be missing here
      const axis = chart.scales['x'];

      const x = axis.min + relX * (axis.max - axis.min);
      this.onX(x);
    }
  }

  draw(): void {
    if (this.context) {
      const f = this.getF();

      const points = utils.iterateFunction(f, this.x, this.skip, this.iterations);

      const minReducer = (accumulator: number, currentValue: number) => Math.min(accumulator, currentValue);
      const maxReducer = (accumulator: number, currentValue: number) => Math.max(accumulator, currentValue);
      const lower = points.reduce(minReducer, this.xMin);
      const upper = points.reduce(maxReducer, this.xMax);

      const dx = (upper - lower) / 100;
      const it = utils.makeRangeIterator(lower, upper, dx);

      const xs = Array.from(it);
      const data = xs.map(x => ({ x: x, y: f(x) }));
      const identity = xs.map(x => ({ x: x, y: x }));

      const web = utils.createPath(points);

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.context, {
        type: 'line',
        data: {
          datasets: [{
            label: 'identity',
            data: identity,
            borderColor: 'rgba(0, 255, 0, 255)',
            pointRadius: 0
          }, {
            label: 'function',
            data: data,
            borderColor: 'rgba(255, 0, 0, 255)',
            pointRadius: 0
          }, {
            label: 'iterates',
            data: web,
            cubicInterpolationMode: 'monotone',
            borderColor: 'rgba(0, 0, 255, 255)'
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom'
            },
            y: {
              type: 'linear',
              position: 'left'
            }
          },
          onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => this.onClick(event, elements, chart)
        }
      });
      this.chart.resize();
    }
  }

}
