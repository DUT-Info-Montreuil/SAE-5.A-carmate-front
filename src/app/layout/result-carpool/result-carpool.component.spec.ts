import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCarpoolComponent } from './result-carpool.component';
import { CARPOOLING_SERVICE_TOKEN, Carpooling, CarpoolingServiceInterface } from 'src/app/interface/carpooling';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MapComponent } from '../map/map.component';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarpoolingComponent } from '../carpooling/carpooling.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

describe('ResultCarpoolComponent', () => {
  let component: ResultCarpoolComponent;
  let fixture: ComponentFixture<ResultCarpoolComponent>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;

  beforeEach(() => {
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['publish', 'search'])
    spyCarpoolingService.$carpoolings = new BehaviorSubject<Carpooling[]>([{
        starting_point: [48.8558516, 2.3588636],
        destination: [48.9757551, 2.559337],
        price: 50,
        is_canceled: false,
        departure_date_time: "2023-01-01T12:00:00",
        driver_id: 1,
        max_passengers: 1,
        seats_taken: 0,
        id: 1,
        first_name: 'John',
        last_name: 'Doe'
    }]);
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', [
      'getAddressByString', 'getAddressByCoords', 'matchingSchoolDeparture', 'getFormattedAddress'
    ]);
    spyAddressService.$schoolList = [
      {lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France'}
    ];
    spyAddressService.getAddressByCoords.and.returnValue(of(''));
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    TestBed.configureTestingModule({
      declarations: [ResultCarpoolComponent, MapComponent, CarpoolingComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatTabsModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatDialogModule
      ],
      providers: [
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
      ]
    });
    fixture = TestBed.createComponent(ResultCarpoolComponent);
    component = fixture.componentInstance;
    component.starting_pointUserToDisplay = [48.8558516, 2.3588636];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
