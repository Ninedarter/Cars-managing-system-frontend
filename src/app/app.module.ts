import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CarsComponent } from './cars/cars.component';
import { ExplotationCostsComponent } from './explotation-costs/explotation-costs.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import 'datatables.net';
import 'datatables.net-bs5';

import { MatGridListModule } from '@angular/material/grid-list';
import { ExpencesComponent } from './expences/expences.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarsComponent,
    ExplotationCostsComponent,
    StatisticsComponent,
    LoginComponent,
    ExpencesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
