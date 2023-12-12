import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './layout/user/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {NOTIFIER_SERVICE_TOKEN} from "./interface/other";
import {AngularNotifierService} from "./service/other/notifier/AngularNotifierService";
import {AUTHENTICATION_SERVICE_TOKEN} from "./interface/user";
import {MockAuthenticationService} from "./service/user/authentication/authentication.service.mock";
import {RootComponent} from "./layout/root/root.component";
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { RegisterComponent } from './layout/user/register/register.component';
import {environment} from "./environement/environement";
import {AuthenticationService} from "./service/user/authentication/authentication.service";
import { HomePageComponent } from './layout/home-page/home-page.component';
import { PublishCarpoolComponent } from './layout/publish-carpool/publish-carpool.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

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
    NavBarComponent,
    RegisterComponent,
    HomePageComponent,
    PublishCarpoolComponent,
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
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: NOTIFIER_SERVICE_TOKEN,
      useClass: AngularNotifierService,
    },
    {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useClass: MockAuthenticationService,
    }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
