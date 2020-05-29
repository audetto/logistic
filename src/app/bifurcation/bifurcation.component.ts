import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as math from 'mathjs'
import * as chart from 'chart.js'
import * as utils from './../utils/math.js';

@Component({
  selector: 'app-bifurcation',
  templateUrl: './bifurcation.component.html',
  styleUrls: ['./bifurcation.component.css']
})
export class BifurcationComponent implements OnInit {

  @ViewChild('xyz') xy;

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
  aMin: number = 2;
  aMax: number = 3;
  skip: number = 100;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let canvas = this.xy.nativeElement;
    this.context = canvas.getContext('2d');
    this.draw();
  }

  getF(a: number): (x: number) => number {
    let f = (x: number) => this.func.evaluate({ x: x, a: a });
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

  onSkip(x?: number): void {
    if (x != null && this.skip !== x) {
      this.skip = x;
      this.draw();
    }
  }

  draw(): void {
    if (this.context && this.func) {
      let lower = this.aMin;
      let upper = this.aMax;

      let dx = (upper - lower) / 100;
      const it = utils.makeRangeIterator(lower, upper + dx, dx);

      let data = [];

      for (const a of it) {
        let f = this.getF(a);

        let iterates = utils.iterateFunction(f, this.x, this.skip, 100);
        for (const xy of iterates) {
          data.push({ x: a, y: xy.x });
        }
      }

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new chart.Chart(this.context, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'bifurcation',
            data: data,
            yAxisID: 'y',
            borderColor: 'rgba(255, 0, 0, 255)',
            pointRadius: 1
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
