import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './layout/user/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from "@angular/common/http";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {NOTIFIER_SERVICE_TOKEN} from "./interface/other";
import {AngularNotifierService} from "./service/other/notifier/AngularNotifierService";
import {AUTHENTICATION_SERVICE_TOKEN, USER_SERVICE_TOKEN} from "./interface/user";
import {MockAuthenticationService} from "./service/user/authentication/authentication.service.mock";
import {RootComponent} from "./layout/root/root.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './layout/user/register/register.component';
import {environment} from "./environement/environement";
import {AuthenticationService} from "./service/user/authentication/authentication.service";
import { PassengerProfilesComponent } from './layout/user/passenger-profile/passenger-profiles.component';
import { PROFILE_SERVICE_TOKEN } from './interface/profiles';
import { ProfilesService } from './service/user/profiles/profiles.service';
import { MockProfilesService } from './service/user/profiles/profiles.service.mock';
import { DriverProfileComponent } from './layout/user/driver-profile/driver-profile.component';
import { UserService } from './service/user/user.service';
import { MockUserService } from './service/user/user.service.mock';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    LoginComponent,
    RootComponent,
    RegisterComponent,
    PassengerProfilesComponent,
    DriverProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: NOTIFIER_SERVICE_TOKEN,
      useClass: AngularNotifierService,
    }, {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useClass: environment.production ? AuthenticationService : MockAuthenticationService,
    }, {
      provide: PROFILE_SERVICE_TOKEN,
      useClass: environment.production ? ProfilesService : MockProfilesService,
    }, {
      provide: USER_SERVICE_TOKEN,
      useClass: environment.production ? UserService : MockUserService,
    }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
