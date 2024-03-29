import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TheFunction } from '../utils/func';
import * as mathjs from 'mathjs';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-function',
    templateUrl: './function.component.html',
    styleUrls: ['./function.component.css'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, MatSlider, MatSliderThumb]
})
export class FunctionComponent implements OnInit {
    expression: string = 'a*x*(1-x)';
    order: number = 1;
    messages: string = '';

    private maths: mathjs.MathJsInstance;
    private func?: mathjs.EvalFunction;
    private deriv?: mathjs.EvalFunction;

    @Output()
    private compile = new EventEmitter<TheFunction>();

    constructor() {
        this.maths = mathjs.create(mathjs.all, {});
    }

    ngOnInit(): void {
        this.parseString(this.expression);
    }

    private parseString(expression: string): void {
        const node = this.maths.parse(expression);
        this.messages = 'OK';
        this.compileNode(node);
    }

    private compileNode(node: mathjs.MathNode): void {
        this.func = node.compile();

        const dnode = this.maths.derivative(node, 'x');
        this.deriv = dnode.compile();

        this.publish(this.func, this.deriv);
    }

    private publish(f: mathjs.EvalFunction, d: mathjs.EvalFunction): void {
        const n = this.order;

        // iterated function
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

        // derivative of the iterated function
        //                          f'(x)
        //               f'(f(x)) * f'(x)
        // f'(f(f(x))) * f'(f(x)) * f'(x)
        function dax(a: number, x: number): number {
            let result = x;
            let d_result = 1.0;
            for (let i = 0; i < n; ++i) {
                const der = d.evaluate({ a: a, x: result });
                d_result *= der;
                result = f.evaluate({ a: a, x: result });
            }
            if (Number.isFinite(d_result)) {
                return d_result;
            } else {
                throw `Not a finite number: ${typeof d_result}`;
            }
        }

        this.compile.emit({ func: fax, deriv: dax });
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

    onOrder(order: number): void {
        console.log(order);
        if (order != null && order !== this.order) {
            this.order = order;
            if (this.func && this.deriv) {
                this.publish(this.func, this.deriv);
            }
        }
    }

}
