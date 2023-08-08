import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ExplotationCostsComponent } from './explotation-costs/explotation-costs.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { CarsComponent } from './cars/cars.component';

const routes: Routes = [
{path: "home", component:HomeComponent},
{path: "cars", component:CarsComponent},
{path: 'explotation/:vinCode', component: ExplotationCostsComponent },
{path: "statistics/:vinCode", component:StatisticsComponent},
{path: "expences/:vinCode", component:StatisticsComponent},
{path: "login", component:LoginComponent},
{path: "", redirectTo:"home", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
