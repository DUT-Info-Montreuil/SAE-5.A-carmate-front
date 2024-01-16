import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarpoolingComponent } from './carpooling.component';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { MatCardModule } from '@angular/material/card';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CarpoolingComponent', () => {
  let component: CarpoolingComponent;
  let fixture: ComponentFixture<CarpoolingComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;

  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', [
      'getAddressByString', 'getAddressByCoords', 'matchingSchoolDeparture', 'getFormattedAddress'
    ]);
    TestBed.configureTestingModule({
      declarations: [CarpoolingComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule
      ],
      providers: [
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
      ]
    });
    fixture = TestBed.createComponent(CarpoolingComponent);
    component = fixture.componentInstance;
    spyAddressService.$schoolList = [
      {lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France'}
    ];
    spyAddressService.getFormattedAddress.and.returnValue(of('IUT de Tremblay-en-France'));
    component._carpooling = {
      starting_point: [48.9757551, 2.559337],
      destination: [48.8558516, 2.3588636],
      price: 50,
      is_canceled: false,
      departure_date_time: "2023-01-01T12:00:00",
      driver_id: 1,
      max_passengers: 1,
      seats_taken: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display School name if matchingSchoolDeparture is found', () => {
    expect(component.starting_point)
      .withContext('starting_point must be "IUT de Tremblay-en-France"')
      .toBe('IUT de Tremblay-en-France');

    component._carpooling = {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 50,
      is_canceled: false,
      departure_date_time: "2023-01-01T12:00:00",
      driver_id: 1,
      max_passengers: 1,
      seats_taken: 0
    };

    component.ngOnInit();
    expect(component.destination)
      .withContext('destination must be "IUT de Tremblay-en-France"')
      .toBe('IUT de Tremblay-en-France');
  });

  it('should call updateMap when user click on "Visualiser"', async () => {
    const updateMapSpy = spyOn(component, 'updateMap');
  
    const button = fixture.debugElement.query(By.css('#visualize_id')).nativeElement;
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(updateMapSpy.calls.count())
      .withContext('updateMap must be called once')
      .toEqual(1);
  });
});
