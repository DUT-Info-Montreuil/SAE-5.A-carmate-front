import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarpoolingComponent } from './carpooling.component';
import {
  ADDRESS_SERVICE_TOKEN,
  AddressServiceInterface,
} from 'src/app/interface/other';
import { MatCardModule } from '@angular/material/card';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CarpoolingDialogComponent } from '../carpooling-dialog/carpooling-dialog.component';

describe('CarpoolingComponent', () => {
  let component: CarpoolingComponent;
  let fixture: ComponentFixture<CarpoolingComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', [
      'getAddressByString',
      'getAddressByCoords',
      'matchingSchoolDeparture',
      'getFormattedAddress',
    ]);
    spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      declarations: [CarpoolingComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatDialogModule],
      providers: [
        { provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService },
        { provide: MatDialog, useValue: spyDialog },
      ],
    });
    fixture = TestBed.createComponent(CarpoolingComponent);
    component = fixture.componentInstance;
    spyAddressService.$schoolList = [
      { lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France' },
    ];
    spyAddressService.getFormattedAddress.and.returnValue(
      of('IUT de Tremblay-en-France'),
    );
    component._carpooling = {
      starting_point: [48.9757551, 2.559337],
      destination: [48.8558516, 2.3588636],
      price: 50,
      departure_date_time: '2023-01-01T12:00:00',
      driver_id: 1,
      max_passengers: 1,
      seats_taken: 0,
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
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
      departure_date_time: '2023-01-01T12:00:00',
      driver_id: 1,
      max_passengers: 1,
      seats_taken: 0,
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
    };

    component.ngOnInit();
    expect(component.destination)
      .withContext('destination must be "IUT de Tremblay-en-France"')
      .toBe('IUT de Tremblay-en-France');
  });

  it('should call updateMap when user click on "Visualiser"', async () => {
    const updateMapSpy = spyOn(component, 'updateMap');

    const button = fixture.debugElement.query(
      By.css('#visualize_id'),
    ).nativeElement;
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(updateMapSpy.calls.count())
      .withContext('updateMap must be called once')
      .toEqual(1);
  });

  it('should call openDialog() when user click on "Réserver"', async () => {
    const openDialogSpy = spyOn(component, 'openDialog');
    const button = fixture.debugElement.query(By.css('#book_id')).nativeElement;

    button.click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(openDialogSpy.calls.count())
      .withContext('openDialog must be called once')
      .toEqual(1);
  });

  it('should open the dialog when clicking button "Réserver"', async () => {
    const dialogData = {
      width: '1000px',
      data: {
        carpooling: component._carpooling,
        _searchParams: component._searchParams,
      },
    };
    const button = fixture.debugElement.query(By.css('#book_id')).nativeElement;

    button.click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(spyDialog.open)
      .withContext('openDialog must be called with CarpoolingDialogComponent')
      .toHaveBeenCalledWith(CarpoolingDialogComponent, dialogData);
  });
});
