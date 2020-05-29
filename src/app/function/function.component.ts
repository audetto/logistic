import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as math from 'mathjs'

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

  @Output() compile = new EventEmitter<math.EvalFunction>();

  constructor() { }

  ngOnInit(): void {
    this.parseString(this.expression);
  }

  parseString(expression: string): void {
    let node = math.parse(expression);
    this.messages = 'OK';
    this.compileNode(node);
  }

  compileNode(node: math.MathNode): void {
    this.node = node;
    this.func = this.node.compile();
    this.compile.emit(this.func);
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
      var derivative = math.derivative(this.node, 'x');
      derivative = math.simplify(derivative);
      this.expression = derivative.toString();
      this.compileNode(derivative);
    }
  }

}
