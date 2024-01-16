import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CARPOOLING_SERVICE_TOKEN, Carpooling, CarpoolingServiceInterface } from "src/app/interface/carpooling";
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from "../../interface/other";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResultCarpoolComponent } from '../result-carpool/result-carpool.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MapComponent } from '../map/map.component';
import { BehaviorSubject, of } from 'rxjs';
import { CarpoolingComponent } from '../carpooling/carpooling.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;

  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getAddressByString', 'getAddressByCoords', 'matchingSchoolDeparture']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['publish', 'search'])
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    spyCarpoolingService.$carpoolings = new BehaviorSubject<Carpooling[]>([
      {
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 50,
          is_canceled: false,
          departure_date_time: "2023-01-01T12:00:00",
          driver_id: 1,
          max_passengers: 1,
      },
      {
          starting_point: [48.8520, 2.3176],
          destination: [48.8569,2.3817],
          price: 40,
          is_canceled: false,
          departure_date_time: "2023-02-15T08:30:00",
          driver_id: 2,
          max_passengers: 2,
      },
    ]);
    spyAddressService.$schoolList = [
      {lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France'}
    ];
    spyAddressService.getAddressByCoords.and.returnValue(of(''));
    TestBed.configureTestingModule({
      declarations: [HomePageComponent, SearchBarComponent, ResultCarpoolComponent, MapComponent, CarpoolingComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
      ]
    });
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
