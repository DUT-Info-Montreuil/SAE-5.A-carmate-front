import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/user/login/login.component";
import {RegisterComponent} from "./layout/user/register/register.component";


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
      path: 'register',
      component: RegisterComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
