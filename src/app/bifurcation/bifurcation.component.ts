import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as utils from '../utils/math';
import { FunctionAX } from '../function/function.component'

@Component({
  selector: 'app-bifurcation',
  templateUrl: './bifurcation.component.html',
  styleUrls: ['./bifurcation.component.css']
})
export class BifurcationComponent implements OnInit {

  @ViewChild('xyz') xy: any;

  private _func!: FunctionAX;
  @Input() set func(f: FunctionAX) {
    this._func = f;
    this.draw();
  }

  chart?: Chart;
  context!: CanvasRenderingContext2D;

  x: number = 0.2;
  aMin: number = 2.9;
  aMax: number = 4;
  skip: number = 100;
  iterations: number = 100;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const canvas = this.xy.nativeElement;
    this.context = canvas.getContext('2d');
    this.draw();
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

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.context, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'bifurcation',
          data: data,
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
            position: 'bottom'
          },
          y: {
            type: 'linear',
            position: 'left'
          }
        }
      }
    });
    this.chart.resize();
  }

}
