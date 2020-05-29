import { Component, ViewChild } from '@angular/core';
import * as math from 'mathjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AndSoft Inc. App';

  func: math.EvalFunction;

  ngOnInit(): void {
  }

  onCompile(func: math.EvalFunction): void {
    this.func = func;
  }

}
