import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/user/login/login.component";
import {RegisterComponent} from "./layout/user/register/register.component";
import { HomePageComponent } from './layout/home-page/home-page.component';
import { PublishCarpoolComponent } from './layout/publish-carpool/publish-carpool.component';
import { PassengerProfilesComponent } from './layout/user/passenger-profile/passenger-profiles.component';
import { DriverProfileComponent } from './layout/user/driver-profile/driver-profile.component';
import { ValidationComponent } from './layout/admin/validation/list/validation_list.component';
import { ValidationDocComponent } from './layout/admin/validation/document/validation_doc.component';
import { SideBarComponent } from "./layout/admin/side-bar/side-bar.component";
import { CreateSubscriptionComponent } from './layout/create-subscription/create-subscription.component';
import { ScoreboardPageComponent } from './layout/scoreboard-page/scoreboard-page.component';
import {BecomeDriverComponent} from "./layout/become-driver/become-driver.component";
import { TripsPageComponent } from './layout/trips-page/trips-page.component';

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
    },
    {
      path: 'passenger-profile',
      component: PassengerProfilesComponent
    },
    {
      path: 'driver-profile',
      component: DriverProfileComponent
    },
    {
      path: 'admin',
      component: SideBarComponent,
      children: [
        {
          path: 'license/to-validate',
          component: ValidationComponent
        },
        {
          path: 'license',
          component: ValidationDocComponent
        },
      ]
    },
    {
      path: 'create-subscription',
      component: CreateSubscriptionComponent
    },
    {
      path: 'scoreboard',
      component: ScoreboardPageComponent
    },
    {
      path: 'become-driver',
      component: BecomeDriverComponent
    },
    {
      path: 'trips',
      component: TripsPageComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
