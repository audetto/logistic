import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { create, all, MathJsStatic } from 'mathjs/number';

type func_t = (a: number, x: number) => number;

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {

  expression: string = 'a*sin(x)';
  node: math.MathNode;
  func: math.EvalFunction;
  messages: string;
  maths: Partial<MathJsStatic>;

  @Output() compile = new EventEmitter<func_t>();

  constructor() {
    this.maths = create({ all }, {});
  }

  ngOnInit(): void {
    this.parseString(this.expression);
  }

  parseString(expression: string): void {
    let node = this.maths.parse(expression);
    this.messages = 'OK';
    this.compileNode(node);
  }

  compileNode(node: math.MathNode): void {
    this.node = node;
    this.func = this.node.compile();

    const f = this.func;

    function fax(a: number, x: number) {
      const result = f.evaluate({ a: a, x: x });
      if (Number.isFinite(result)) {
        return result;
      } else {
        throw `Not a number: ${typeof result}`;
      }
    }

    this.compile.emit(fax);
  }

  onExpression(expression: string): void {
    this.expression = expression;
    try {
      this.parseString(expression);
    } catch (error) {
      let e: Error = error;
      this.messages = e.message;
    }
  }

  onDifferentiate(): void {
    if (this.node) {
      var derivative = this.maths.derivative(this.node, 'x');
      derivative = this.maths.simplify(derivative);
      this.expression = derivative.toString();
      this.compileNode(derivative);
    }
  }

}
