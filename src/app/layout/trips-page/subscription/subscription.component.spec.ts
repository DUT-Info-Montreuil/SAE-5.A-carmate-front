import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionComponent } from './subscription.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, WeekDay } from 'src/app/interface/carpooling';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PROFILE_SERVICE_TOKEN, ProfilesServiceInterface } from 'src/app/interface/profiles';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as moment from 'moment';
import { MatMenuModule } from '@angular/material/menu';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyProfileService: jasmine.SpyObj<ProfilesServiceInterface>;
  beforeEach(() => {
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['find', 'getSubscriptions']);
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getAddressByString']);
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getFormattedAddress']);
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    spyProfileService = jasmine.createSpyObj('ProfilesServiceInterface', ['getDriverProfile']);
    spyProfileService.getDriverProfile.and.returnValue(of({
      user_id: 2,
      driver_id: 1,
      first_name: "John",
      last_name: "Doe",
      description: "driver description",
      createdAt: "",
      nb_carpools_done: 5,
      profile_picture: ''
  }));
    TestBed.configureTestingModule({
      declarations: [SubscriptionComponent],
      imports: [
        MatExpansionModule,
        FontAwesomeModule,
        MatListModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
      ],
      providers: [
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfileService}
      ]
    });
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    component.subscription =
    {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      start_date: 1704067200,
      end_date: 1706745600,
      start_hour: "08:30",
      days: ["Monday", "Wednesday", "Friday"],
      label: "Tous les lundi mercredi et vendredi de janvier",
      carpools: [
        {
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: "2024-01-03T08:30:00",
          driver_id: 1,
          max_passengers: 2,
          seats_taken: 1,
        }
        ]
      };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data to display', () => {
    expect(component.startingPointToDisplay).toBeDefined();
    expect(component.destinationToDisplay).toBeDefined();
    expect(component.pendingCarpoolingsToDisplay).toBeDefined();
    expect(component.bookedCarpoolingsToDisplay.length).toEqual(1);
  });

  it('should translate days correctly', () => {
    const days = ['Monday', 'Tuesday', 'Wednesday'] as WeekDay[];
    const translatedDays = component.translateDays(days);
    expect(translatedDays).toEqual(['Lundi', 'Mardi', 'Mercredi']);
  });
});
