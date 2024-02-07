import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import * as utils from '../utils/math';
import { TheFunction, FunctionAX } from '../utils/func';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
    selector: 'app-bifurcation',
    templateUrl: './bifurcation.component.html',
    styleUrls: ['./bifurcation.component.css'],
    standalone: true,
    imports: [MatGridList, MatGridTile, MatFormField, MatLabel, FormsModule, MatInput]
})
export class BifurcationComponent implements OnInit, OnDestroy {

  @ViewChild('xyz') xy!: ElementRef;

  private _func!: TheFunction;
  @Input() set func(f: TheFunction) {
    this._func = f;
    this.draw();
  }

  chart?: Chart;
  chartData!: ChartConfiguration;

  x: number = 0.2;
  n: number = 200;
  aMin: number = 2.9;
  aMax: number = 4;
  skip: number = 100;
  iterations: number = 100;

  ngOnInit(): void {
    this.chartData = {
      type: 'line',
      data: {
        datasets: [{
          label: 'bifurcation',
          yAxisID: 'y',
          data: [],
          borderColor: 'rgba(255, 0, 0, 255)',
          pointRadius: 1,
          showLine: false,
        },{
          label: 'lyapunov',
          yAxisID: 'y1',
          data: [],
          borderColor: 'rgba(0, 0, 255, 155)',
          borderWidth: 1,
          pointRadius: 0,
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
              text: 'a',
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'fixed point',
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    };
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

  getF(a: number): (x: number) => number {
    const f = (x: number) => this._func.func(a, x);
    return f;
  }

  getD(a: number): (x: number) => number {
    const f = (x: number) => this._func.deriv(a, x);
    return f;
  }

  onX(x?: number): void {
    if (x != null && this.x !== x) {
      this.x = x;
      this.draw();
    }
  }

  onMax(x?: number): void {
    if (x != null && this.aMax !== x) {
      this.aMax = x;
      this.draw();
    }
  }

  onMin(x?: number): void {
    if (x != null && this.aMin !== x) {
      this.aMin = x;
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

  onN(n?: number): void {
    if (n != null && this.n !== n) {
      this.n = n;
      this.draw();
    }
  }

  draw(): void {
    if (this.isReady()) {
      const lower = this.aMin;
      const upper = this.aMax;

      const dx = (upper - lower) / this.n;
      const it = utils.makeRangeIterator(lower, upper, dx);

      const data0 = [];
      const data1 = [];

      for (const a of it) {
        const f = this.getF(a);
        const d = this.getD(a);

        const points = utils.iterateFunction2(f, this.x, this.skip, this.iterations, 0.000001);
        for (const point of points) {
          data0.push({ x: a, y: point });
        }
        const lyap = utils.getLyapunov(d, points);
        data1.push({ x: a, y: lyap });
      }

      this.chartData.data.datasets[0].data = data0;
      this.chartData.data.datasets[1].data = data1;
      this.chart?.update();
    }
  }

}
