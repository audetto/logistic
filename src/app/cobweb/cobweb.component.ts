import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ActiveElement, ChartEvent, ChartConfiguration } from 'chart.js/auto'
import * as utils from '../utils/math';
import { TheFunction, FunctionAX } from '../utils/func';

@Component({
  selector: 'app-cobweb',
  templateUrl: './cobweb.component.html',
  styleUrls: ['./cobweb.component.css']
})
export class CobwebComponent implements OnInit, OnDestroy {

  @ViewChild('xy') xy!: ElementRef;

  private _func!: TheFunction;
  @Input() set func(f: TheFunction) {
    this._func = f;
    this.draw();
  }

  chart?: Chart;
  chartData!: ChartConfiguration;

  x: number = 0.2;
  a: number = 3.0;
  xMin: number = 0;
  xMax: number = 1;
  skip: number = 0;
  iterations: number = 100;
  lyapunov: number = 0;

  ngOnInit(): void {
    this.chartData = {
      type: 'line',
      data: {
        datasets: [{
          label: 'identity',
          data: [],
          borderColor: 'rgba(0, 255, 0, 255)',
          pointRadius: 0
        }, {
          label: 'function',
          data: [],
          borderColor: 'rgba(255, 0, 0, 255)',
          pointRadius: 0
        }, {
          label: 'iterates',
          data: [],
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
            position: 'bottom',
            title: {
              display: true,
              text: 'x'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'f(x)'
            }
          }
        },
        onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => this.onClick(event, elements, chart)
      }
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.xy.nativeElement;
    const context = canvas.getContext('2d');

    this.chart = new Chart(context, this.chartData);
    this.draw();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = undefined;
  }

  isReady(): boolean {
    return !!this.chart && !!this._func;
  }

  getF(): (x: number) => number {
    const f = (x: number) => this._func.func(this.a, x);
    return f;
  }

  getD(): (x: number) => number {
    const f = (x: number) => this._func.deriv(this.a, x);
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
    if (this.isReady()) {
      const f = this.getF();
      const d = this.getD();

      const points = utils.iterateFunction(f, this.x, this.skip, this.iterations);

      this.lyapunov = utils.getLyapunov(d, points);

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

      this.chartData.data.datasets[0].data = identity;
      this.chartData.data.datasets[1].data = data;
      this.chartData.data.datasets[2].data = web;
      this.chart?.update();
    }
  }

}
