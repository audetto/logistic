import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as mathjs from 'mathjs';

export type FunctionAX = (a: number, x: number) => number;

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {
  expression: string = 'a*x*(1-x)';
  order: number = 1;
  messages: string = '';
  maths: mathjs.MathJsStatic;
  node?: mathjs.MathNode;
  func?: mathjs.EvalFunction;

  @Output() compile = new EventEmitter<FunctionAX>();

  constructor() {
    this.maths = mathjs.create(mathjs.all, {});
  }

  ngOnInit(): void {
    this.parseString(this.expression);
  }

  parseString(expression: string): void {
    const node = this.maths.parse(expression);
    this.messages = 'OK';
    this.compileNode(node);
  }

  compileNode(node: mathjs.MathNode): void {
    this.node = node;
    this.func = node.compile();

    this.publish(this.func);
  }

  publish(f: mathjs.EvalFunction): void {
    const n = this.order;

    function fax(a: number, x: number): number {
      let result = x;
      for (let i = 0; i < n; ++i) {
        result = f.evaluate({ a: a, x: result });
      }
      if (Number.isFinite(result)) {
        return result;
      } else {
        throw `Not a finite number: ${typeof result}`;
      }
    }

    this.compile.emit(fax);
  }

  onExpression(expression: string): void {
    this.expression = expression;
    try {
      this.parseString(expression);
    } catch (error) {
      const e: Error = error as Error;
      this.messages = e.message;
    }
  }

  onOrder(order: number) : void {
    console.log(order);
    if (order != null && order !== this.order) {
      this.order = order;
      if (this.func) {
        this.publish(this.func);
      }
    }
  }

}
