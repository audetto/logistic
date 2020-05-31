import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as chart from 'chart.js'
import * as utils from './../utils/math.js';

type func_t = (a: number, x: number) => number;

@Component({
  selector: 'app-bifurcation',
  templateUrl: './bifurcation.component.html',
  styleUrls: ['./bifurcation.component.css']
})
export class BifurcationComponent implements OnInit {

  @ViewChild('xyz') xy;

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
    let f = (x: number) => this.func(a, x);
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

      let dx = (upper - lower) / 200;
      const it = utils.makeRangeIterator(lower, upper + dx, dx);

      let data = [];

      for (const a of it) {
        let f = this.getF(a);

        let points = utils.iterateFunction2(f, this.x, this.skip, 200, 0.00001);
        for (const point of points) {
          data.push({ x: a, y: point });
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
          animation: null,
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
