import { Component } from '@angular/core';

import { TheFunction } from './utils/func';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  andsoft = 'AndSoft Inc.';
  name = 'Logistic App';
  link = 'http://www.odetti.it/andrea/products.htm';

  func!: TheFunction;

  onCompile(func: TheFunction): void {
    this.func = func;
  }

}
