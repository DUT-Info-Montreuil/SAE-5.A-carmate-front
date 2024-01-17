import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './layout/user/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from "@angular/common/http";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {ADDRESS_SERVICE_TOKEN, NOTIFIER_SERVICE_TOKEN} from "./interface/other";
import {AngularNotifierService} from "./service/other/notifier/AngularNotifierService";
import {AUTHENTICATION_SERVICE_TOKEN, USER_SERVICE_TOKEN} from "./interface/user";
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
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PassengerProfilesComponent } from './layout/user/passenger-profile/passenger-profiles.component';
import { PROFILE_SERVICE_TOKEN } from './interface/profiles';
import { ProfilesService } from './service/user/profiles/profiles.service';
import { MockProfilesService } from './service/user/profiles/profiles.service.mock';
import { DriverProfileComponent } from './layout/user/driver-profile/driver-profile.component';
import { UserService } from './service/user/user.service';
import { MockUserService } from './service/user/user.service.mock';
import { CARPOOLING_SERVICE_TOKEN } from './interface/carpooling';
import { CarpoolingService } from './service/carpooling/carpooling.service';
import { AddressService } from './service/address/address.service';
import { MockAddressService } from './service/address/address.service.mock';
import { MockCarpoolingService } from './service/carpooling/carpooling.service.mock';
import { SearchBarComponent } from './layout/search-bar/search-bar.component';
import { ResultCarpoolComponent } from './layout/result-carpool/result-carpool.component';
import { MatCardModule } from '@angular/material/card';
import { CarpoolingComponent } from './layout/carpooling/carpooling.component';
import { MapComponent } from './layout/map/map.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateSubscriptionComponent } from './layout/create-subscription/create-subscription.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScoreboardPageComponent } from './layout/scoreboard-page/scoreboard-page.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { frPaginatorIntl } from './utils/french-paginator-intl';
import { SCORE_SERVICE_TOKEN } from './interface/score';
import { ScoreService } from './service/score/score.service';
import { MockScoreService } from './service/score/score.service.mock';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { SubscriptionComponent } from './layout/trips-page/subscription/subscription.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { TripsPageComponent } from './layout/trips-page/trips-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SubscriptionDialogComponent } from './layout/trips-page/subscription/subscription-dialog/subscription-dialog.component';
import { PublishedCarpoolingsComponent } from './layout/trips-page/published-carpoolings/published-carpoolings.component';
import { PublishedCarpoolingDialogComponent } from './layout/trips-page/published-carpoolings/published-carpooling-dialog/published-carpooling-dialog.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {BecomeDriverComponent} from "./layout/become-driver/become-driver.component";
import { ValidationComponent } from './layout/admin/validation/list/validation_list.component';
import { VALIDATION_SERVICE_TOKEN } from './interface/admin';
import { ValidationDocComponent } from './layout/admin/validation/document/validation_doc.component';
import { ValidationServiceMock } from './service/admin/validation/validation.service.mock';
import { ValidationService } from './service/admin/validation/validation.service';
import { SideBarComponent } from './layout/admin/side-bar/side-bar.component';
import { CarpoolingDialogComponent } from './layout/carpooling-dialog/carpooling-dialog.component';
import { MyCarpoolingsComponent } from './layout/trips-page/my-carpoolings/my-carpoolings.component';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';

registerLocaleData(localeFr);
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
    RegisterComponent,
    PassengerProfilesComponent,
    DriverProfileComponent,
    PublishCarpoolComponent,
    ValidationComponent,
    ValidationDocComponent,
    SearchBarComponent,
    ResultCarpoolComponent,
    CarpoolingComponent,
    MapComponent,
    SideBarComponent,
    CreateSubscriptionComponent,
    ScoreboardPageComponent,
    BecomeDriverComponent,
    SubscriptionComponent,
    TripsPageComponent,
    SubscriptionDialogComponent,
    PublishedCarpoolingsComponent,
    PublishedCarpoolingDialogComponent,
    MyCarpoolingsComponent,
    CarpoolingDialogComponent,
    RatingDialogComponent,
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
    MatAutocompleteModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    NgxMatFileInputModule,
  ],
  providers: [
    {
      provide: NOTIFIER_SERVICE_TOKEN,
      useClass: AngularNotifierService,
    },
    {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useClass: environment.production ? AuthenticationService : MockAuthenticationService,
    },
    {
      provide: PROFILE_SERVICE_TOKEN,
      useClass: environment.production ? ProfilesService : MockProfilesService,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: environment.production ? UserService : MockUserService,
    },
    {
    provide: VALIDATION_SERVICE_TOKEN,
    useClass:  environment.production ? ValidationService : ValidationServiceMock,
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'fr-FR'
    },
    {
      provide: CARPOOLING_SERVICE_TOKEN,
      useClass: environment.production ? CarpoolingService : MockCarpoolingService,
    },
    {
      provide: ADDRESS_SERVICE_TOKEN,
      useClass: environment.production ? AddressService : MockAddressService,
    },
    {
      provide: SCORE_SERVICE_TOKEN,
      useClass: environment.production ? ScoreService : MockScoreService,
    },
    {
      provide: MatPaginatorIntl,
      useClass: frPaginatorIntl
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
