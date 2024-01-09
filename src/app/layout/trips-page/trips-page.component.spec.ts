import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsPageComponent } from './trips-page.component';
import { CarpoolingServiceInterface, CARPOOLING_SERVICE_TOKEN, Subscription } from 'src/app/interface/carpooling';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { of } from 'rxjs';
import { SubscriptionComponent } from 'src/app/layout/trips-page/subscription/subscription.component';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule } from '@angular/material/list';
import { PROFILE_SERVICE_TOKEN, ProfilesServiceInterface } from 'src/app/interface/profiles';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

describe('TripsPageComponent', () => {
  let component: TripsPageComponent;
  let fixture: ComponentFixture<TripsPageComponent>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyProfileService: jasmine.SpyObj<ProfilesServiceInterface>;
  beforeEach(() => {
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['getSubscriptions']);
    spyCarpoolingService.getSubscriptions.and.returnValue(of([
      {
        starting_point: [0, 0],
        destination: [0, 0],
        start_date: 0,
        end_date: 0,
        start_hour: "",
        days: ["Monday"],
        label: "",
        carpools: [
          {
            starting_point: [0, 0],
            destination: [0, 0],
            max_passengers: 0,
            price: 0,
            departure_date_time: "2023-01-01T12:00:00",
            is_canceled: false,
            driver_id: 0,
            seats_taken: 0
          }
        ]
      }
    ]));
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getFormattedAddress']);
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    spyProfileService = jasmine.createSpyObj('ProfilesServiceInterface', ['getDriverProfile']);
    spyProfileService.getDriverProfile.and.returnValue(of({
      user_id: 0,
      first_name: '',
      last_name: '',
      driver_id: 0,
      description: '',
      createdAt: '',
      nb_carpools_done: 0,
      profile_picture: ''
    }));
    
    TestBed.configureTestingModule({
      declarations: [
        TripsPageComponent,
        SubscriptionComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FontAwesomeModule,
        MatCardModule,
        MatExpansionModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule
      ],
      providers: [
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfileService}
      ]
    });
    fixture = TestBed.createComponent(TripsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSubscriptions on ngOnInit', () => {
    const getSubscriptionsSpy = spyCarpoolingService.getSubscriptions.and.returnValue(of([]));
    component.ngOnInit();
    expect(getSubscriptionsSpy).toHaveBeenCalled();
  });

  it('should set subscriptions on ngOnInit', () => {
    const testSubscriptions: Subscription[] = [
      {
        starting_point: [0, 0],
        destination: [0, 0],
        start_date: 0,
        end_date: 0,
        start_hour: "",
        days: ["Monday"],
        label: "",
        carpools: [
          {
            starting_point: [0, 0],
            destination: [0, 0],
            max_passengers: 0,
            price: 0,
            departure_date_time: "2023-01-01T12:00:00",
            is_canceled: false,
            driver_id: 0,
            seats_taken: 0
          }
        ]
      }
    ];
    spyCarpoolingService.getSubscriptions.and.returnValue(of(testSubscriptions));
    component.ngOnInit();
    expect(component.subscriptions).toEqual(testSubscriptions);
  });
});