import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/user/login/login.component";
import {RegisterComponent} from "./layout/user/register/register.component";
import { HomePageComponent } from './layout/home-page/home-page.component';
import { PublishCarpoolComponent } from './layout/publish-carpool/publish-carpool.component';

const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'home',
      component: HomePageComponent
    },
    {
      path: 'publish',
      component: PublishCarpoolComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }