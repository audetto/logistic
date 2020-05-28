import { Component, ViewChild } from '@angular/core';
import * as math from 'mathjs'
import * as chart from 'chart.js'
import * as utils from './utils/math.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AndSoft Inc. App';

  @ViewChild('xy') xy;

  func: math.EvalFunction;
  x: number;
  y: string;
  messages: string;
  chart: chart.Chart;

  ngOnInit(): void {
  }

  onCompile(func: math.EvalFunction): void {
    this.func = func;
    this.onCalculate();
  }

  onCalculate(): void {
    if (this.x != null && this.func) {
      let scope = {
        x: this.x
      }
      try {
        let y = this.func.evaluate(scope);
        this.y = math.complex(y).format(4);
      } catch (error) {
        let e: Error = error;
        this.func = null;
        this.messages = e.message;
      }
    }
  }

  onX(x?: number): void {
    if (x != null && this.x !== x) {
      this.x = x;
      this.onCalculate();
    }
  }

  onDraw(): void {
    let canvas = this.xy.nativeElement;
    let context: CanvasRenderingContext2D = canvas.getContext("2d");

    let xMin = -10;
    let xMax = 10;
    let dx = 0.1;

    const it = utils.makeRangeIterator(xMin, xMax, dx);

    let xs = Array.from(it);
    let f = (x: number) => this.func.evaluate({ x: x });
    let data = xs.map(x => ({ x: x, y: math.complex(f(x)) }));
    let real = data.map(p => ({ x: p.x, y: p.y.re }));
    let img = data.map(p => ({ x: p.x, y: p.y.im }));


    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new chart.Chart(context, {
      type: 'line',
      data: {
        datasets: [{
          label: "real",
          data: real,
          yAxisID: 'y',
          borderColor: "rgba(255, 0, 0, 255)"
        }, {
          label: "imaginary",
          data: img,
          yAxisID: 'y2',
          borderColor: "rgba(0, 0, 255, 255)"
        }]
      },
      options: {
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
          }, {
            id: 'y2',
            type: 'linear',
            position: 'right'
          }]
        }
      }
    });
    this.chart.resize();
  }

}
