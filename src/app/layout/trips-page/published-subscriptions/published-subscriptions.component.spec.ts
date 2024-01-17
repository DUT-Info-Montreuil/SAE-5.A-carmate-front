import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishedSubscriptionsComponent } from './published-subscriptions.component';
import { LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { AddressServiceInterface, ADDRESS_SERVICE_TOKEN } from 'src/app/interface/other';
import { ProfilesServiceInterface, PROFILE_SERVICE_TOKEN } from 'src/app/interface/profiles';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PublishedSubscriptionsComponent', () => {
  let component: PublishedSubscriptionsComponent;
  let fixture: ComponentFixture<PublishedSubscriptionsComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyProfileService: jasmine.SpyObj<ProfilesServiceInterface>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getFormattedAddress']);
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    spyProfileService = jasmine.createSpyObj('ProfilesServiceInterface', ['getPassengerProfile', 'getDriverProfile']);
    spyProfileService.getPassengerProfile.and.returnValue(of({
      user_id: 0,
      first_name: 'John',
      last_name: 'Doe',
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    }));
    spyProfileService.getDriverProfile.and.returnValue(of({
      driver_id: 0,
      user_id: 0,
      first_name: 'John',
      last_name: 'Doe',
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture',
      car: {
        brand: 'brand',
        model: 'model',
        color: 'color',
        nb_seats: 4,
        license_plate: 'license_plate'
      }
    }));
    spyDialog = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    TestBed.configureTestingModule({
      declarations: [PublishedSubscriptionsComponent],
      imports: [
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatListModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfileService},
        {provide: LOCALE_ID, useValue: 'fr-FR'},
        {provide: MatDialog, useValue: spyDialog}
      ]
    });
    fixture = TestBed.createComponent(PublishedSubscriptionsComponent);
    component = fixture.componentInstance;
    component.publishedSubscription = {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      start_date: 1609459200000,
      end_date: 1609545600000,
      start_hour: '08:00',
      days: ['Monday', 'Tuesday'],
      label: 'label',
      carpools: [{
        id: 1,
        starting_point: [48.8558516, 2.3588636],
        destination: [48.9757551, 2.559337],
        price: 40,
        is_canceled: false,
        departure_date_time: "2024-01-03T08:30:00",
        driver_id: 1,
        max_passengers: 2,
        seats_taken: 1,
        passengers: [1, 2]
      }]
    };
    component.dayTranslations = {
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi',
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});