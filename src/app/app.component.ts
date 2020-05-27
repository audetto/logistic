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

  func: string = 'sin(x)';
  node: math.MathNode;
  compiled: math.EvalFunction;
  messages: string;
  x: number;
  y: number;
  chart: chart.Chart;

  ngOnInit() {
    this.node = math.parse(this.func);
    this.compiled = this.node.compile();
    this.messages = "OK"
  }

  onFunc(value: string) {
    console.log(value);
    this.func = value;
    try {
      this.node = math.parse(value);
      this.compiled = this.node.compile();
      this.messages = "OK"
      this.onCalculate();
    } catch (error) {
      let e: Error = error;
      this.node = null;
      this.compiled = null;
      this.messages = e.message;
    }
  }

  onCalculate() {
    if (this.x != null && this.compiled) {
      let scope = {
        x: this.x
      }
      try {
        this.y = this.compiled.evaluate(scope)
      } catch (error) {
        let e: Error = error;
        this.node = null;
        this.compiled = null;
        this.messages = e.message;
      }
    }
  }

  onX(x?: number) {
    if (x != null && this.x !== x) {
      this.x = x;
      this.onCalculate();
    }
  }

  onDifferentiate() {
    if (this.node) {
      var derivative = math.derivative(this.node, 'x');
      derivative = math.simplify(derivative);
      this.func = derivative.toString();
      this.node = derivative;
      this.compiled = this.node.compile();
      this.onCalculate();
    }
  }

  onDraw() {
    let canvas = this.xy.nativeElement;
    let context: CanvasRenderingContext2D = canvas.getContext("2d");

    let xMin = -10;
    let xMax = 10;
    let dx = 0.1;

    const it = utils.makeRangeIterator(xMin, xMax, dx);

    let xs = Array.from(it);
    let f = (x: number) => this.compiled.evaluate({ x: x });
    let data = xs.map(x => ({ x: x, y: f(x) }));

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new chart.Chart(context, {
      type: 'scatter',
      data: {
        datasets: [{
          label: this.func,
          data: data
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        }
      }
    });
    this.chart.resize();
  }

}
