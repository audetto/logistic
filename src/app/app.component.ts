import { Component } from '@angular/core';

import { TheFunction } from './utils/func';
import { BifurcationComponent } from './bifurcation/bifurcation.component';
import { CobwebComponent } from './cobweb/cobweb.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FunctionComponent } from './function/function.component';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatToolbar, MatButton, MatSidenavContainer, MatSidenav, FunctionComponent, MatSidenavContent, MatTabGroup, MatTab, CobwebComponent, BifurcationComponent]
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
