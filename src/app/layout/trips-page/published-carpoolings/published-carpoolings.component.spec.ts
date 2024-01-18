import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishedCarpoolingsComponent } from './published-carpoolings.component';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import {PassengerProfile, PROFILE_SERVICE_TOKEN, ProfilesServiceInterface} from 'src/app/interface/profiles';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { PublishedCarpoolingDialogComponent } from './published-carpooling-dialog/published-carpooling-dialog.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

describe('PublishedCarpoolingsComponent', () => {
  registerLocaleData(localeFr);
  let component: PublishedCarpoolingsComponent;
  let fixture: ComponentFixture<PublishedCarpoolingsComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyProfileService: jasmine.SpyObj<ProfilesServiceInterface>;
  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getFormattedAddress']);
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    spyProfileService = jasmine.createSpyObj('ProfilesServiceInterface', ['getPassengerProfile']);
    spyProfileService.getPassengerProfile.and.returnValue(of({
      user_id: 0,
      first_name: 'John',
      last_name: 'Doe',
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    }));
    TestBed.configureTestingModule({
      declarations: [PublishedCarpoolingsComponent],
      imports: [
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfileService},
        {provide: LOCALE_ID, useValue: 'fr-FR'}
      ]
    });
    fixture = TestBed.createComponent(PublishedCarpoolingsComponent);
    component = fixture.componentInstance;
    component.publishedCarpooling =  {
      id: 1,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: "2024-01-15T08:30:00",
      driver_id: 1,
      max_passengers: 2,
      seats_taken: 1,
      passengers_profile: [
        {
          first_name: 'John',
          last_name: 'Doe'
        } as PassengerProfile,
      ]

    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize carpoolingToDisplay on ngOnInit', () => {
    const date = new Date(component.publishedCarpooling.departure_date_time);
    date.setHours(date.getHours() - 1);
    expect(component.carpoolingToDisplay.departureDate).toEqual(date);
    expect(component.carpoolingToDisplay.max_passengers).toEqual(component.publishedCarpooling.max_passengers);
    expect(component.carpoolingToDisplay.seats_takens).toEqual(component.publishedCarpooling.seats_taken!);
    expect(spyAddressService.getFormattedAddress).toHaveBeenCalledTimes(2);
  });

  it('should update carpoolingToDisplay when getFormattedAddress resolves', () => {
    const testAddress = 'Test Address';
    spyAddressService.getFormattedAddress.and.returnValue(of(testAddress));
    component.ngOnInit();

    expect(component.carpoolingToDisplay.departure).toEqual(testAddress);
    expect(component.carpoolingToDisplay.destination).toEqual(testAddress);
  });

  it('should open dialog when openDialog is called', () => {
    const dialogSpy = spyOn(component.dialog, 'open');
    component.openDialog();

    expect(dialogSpy).toHaveBeenCalledWith(PublishedCarpoolingDialogComponent, {
      width: '340px',
      data: {id: component.publishedCarpooling.id}
    });
  });
});
