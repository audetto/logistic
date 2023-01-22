import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import * as utils from '../utils/math';
import { FunctionAX } from '../function/function.component'

@Component({
  selector: 'app-bifurcation',
  templateUrl: './bifurcation.component.html',
  styleUrls: ['./bifurcation.component.css']
})
export class BifurcationComponent implements OnInit, OnDestroy {

  @ViewChild('xyz') xy!: ElementRef;

  private _func!: FunctionAX;
  @Input() set func(f: FunctionAX) {
    this._func = f;
    this.draw();
  }

  chart?: Chart;
  chartData!: ChartConfiguration;

  x: number = 0.2;
  aMin: number = 2.9;
  aMax: number = 4;
  skip: number = 100;
  iterations: number = 100;

  ngOnInit(): void {
    this.chartData = {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'bifurcation',
          data: [],
          borderColor: 'rgba(255, 0, 0, 255)',
          pointRadius: 1
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
              text: 'a'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'fixed point'
            }
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

  getF(a: number): (x: number) => number {
    const f = (x: number) => this._func(a, x);
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

  draw(): void {
    if (this.chart) {
      const lower = this.aMin;
      const upper = this.aMax;

      const dx = (upper - lower) / 200;
      const it = utils.makeRangeIterator(lower, upper, dx);

      const data = [];

      for (const a of it) {
        const f = this.getF(a);

        const points = utils.iterateFunction2(f, this.x, this.skip, this.iterations, 0.00001);
        for (const point of points) {
          data.push({ x: a, y: point });
        }
      }

      this.chartData.data.datasets[0].data = data;
      this.chart.update();
    }
  }

}
