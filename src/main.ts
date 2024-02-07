import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatSliderModule, BrowserModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatGridListModule, MatInputModule, MatSidenavModule, MatTabsModule, MatToolbarModule),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
