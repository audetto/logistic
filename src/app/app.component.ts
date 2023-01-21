import { Component } from '@angular/core';

import { FunctionAX } from './function/function.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  andsoft = 'AndSoft Inc.';
  name = 'Logistic App';
  link = 'http://www.odetti.it/andrea/products.htm';

  func?: FunctionAX;

  onCompile(func: FunctionAX): void {
    this.func = func;
  }

}
