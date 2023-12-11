import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/user/login/login.component";
import {RegisterComponent} from "./layout/user/register/register.component";
import { PassengerProfilesComponent } from './layout/user/passenger-profile/passenger-profiles.component';
import { DriverProfileComponent } from './layout/user/driver-profile/driver-profile.component';

const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },

    {
      path: 'register',
      component: RegisterComponent
    },

    {
      path: 'passenger-profile',
      component: PassengerProfilesComponent
    },

    {
      path: 'driver-profile',
      component: DriverProfileComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
