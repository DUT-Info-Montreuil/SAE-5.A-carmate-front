import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PublishCarpoolComponent } from './publish-carpool.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AddressServiceInterface,
  ADDRESS_SERVICE_TOKEN,
} from 'src/app/interface/address.interface';
import {
  CarpoolingServiceInterface,
  CARPOOLING_SERVICE_TOKEN,
} from 'src/app/interface/carpooling.interface';
import {
  NotifierServiceInterface,
  NOTIFIER_SERVICE_TOKEN,
} from 'src/app/interface/notifier.interface';

describe('PublishCarpoolComponent', () => {
  let component: PublishCarpoolComponent;
  let fixture: ComponentFixture<PublishCarpoolComponent>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;

  const selectDepartureFirstSuggestion = async (inputUser: string) => {
    const inputDebugElement = fixture.debugElement.query(
      By.css('#starting_point_id'),
    );

    inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = inputUser;
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    component.departureTrigger!.openPanel();

    await fixture.whenStable();
    fixture.detectChanges();

    const matOption = document.querySelector('mat-option') as HTMLElement;

    if (!matOption || matOption === undefined) {
      fail('No mat-option elements found');
    }
    matOption.click();

    component.departureTrigger!.closePanel();
  };

  const selectDestinationFirstSuggestion = async (inputUser: string) => {
    const inputDebugElement = fixture.debugElement.query(
      By.css('#destination_id'),
    );

    inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = inputUser;
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    component.destinationTrigger!.openPanel();

    await fixture.whenStable();
    fixture.detectChanges();

    const matOption = document.querySelector('mat-option') as HTMLElement;

    if (!matOption || matOption === undefined) {
      fail('No mat-option elements found');
    }
    matOption.click();

    component.destinationTrigger!.closePanel();
  };

  const selectDate = async (inputUser: string) => {
    const button = fixture.debugElement.query(
      By.css('#date_departure_id'),
    ).nativeElement;

    component['publishForm'].controls.departure_date.setValue(inputUser);

    await fixture.whenStable();
    fixture.detectChanges();
    button.click();
  };

  const selectPassager = async (inputUser: number) => {
    component['publishForm'].controls.max_passengers.setValue(
      String(inputUser),
    );
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const selectPrice = async (inputUser: number) => {
    component['publishForm'].controls.price.setValue(inputUser);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const selectTime = async (inputUser: string) => {
    component['publishForm'].controls.departure_time.setValue(inputUser);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const fillForm = async () => {
    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;
    await selectDepartureFirstSuggestion('1 rue');
    await selectDestinationFirstSuggestion('1 rue');
    await selectDate('2024-12-11T23:00:00.000Z');
    await selectPassager(2);
    await selectPrice(2);
    await selectTime('12:00');
    button.click();
  };

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
      'success',
      'warning',
    ]);
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', [
      'getAddressByString',
      'getAddressByCoords',
      'matchingSchoolDeparture',
      'formatAddress',
    ]);
    spyAddressService.formatAddress.and.returnValue(
      '1 rue de la République, 13001 Marseille',
    );

    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', [
      'publish',
    ]);
    TestBed.configureTestingModule({
      declarations: [PublishCarpoolComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        { provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService },
        { provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService },
      ],
    });
    fixture = TestBed.createComponent(PublishCarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when all required field value are missing', () => {
    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;
    expect(button.disabled)
      .withContext('submit button should be disabled')
      .toBeTruthy();
  });

  it('should disable the submit button when at least one required field value is missing', () => {
    selectDepartureFirstSuggestion('1 rue');
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;
    expect(button.disabled)
      .withContext('submit button should be disabled')
      .toBeTruthy();

    expect(component['publishForm'].controls.starting_point.invalid)
      .withContext('departure should be invalid')
      .toBeTruthy();
  });

  it('should enbale the submit button when selecting the first autocomplete option and filling the date manually', async () => {
    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;

    spyAddressService.getAddressByString.and.returnValue(
      of([
        {
          address: {
            house_number: '1',
            city: 'Marseille',
            road: 'Rue de la République',
            postcode: '13001',
          },
        },
      ]),
    );

    spyCarpoolingService.publish.and.returnValue(of());

    await selectDepartureFirstSuggestion('1 rue');
    await selectDestinationFirstSuggestion('1 rue');
    await selectDate('2024-12-11T23:00:00.000Z');
    await selectPassager(2);
    await selectPrice(2);
    await selectTime('12:00');
    button.click();

    expect(component['publishForm'].controls.starting_point.invalid)
      .withContext('departure must be filled')
      .toBeFalsy();

    expect(component['publishForm'].controls.destination.invalid)
      .withContext('destination must be filled')
      .toBeFalsy();

    expect(component['publishForm'].controls.departure_date.invalid)
      .withContext('departure date must be filled')
      .toBeFalsy();

    expect(component['publishForm'].controls.max_passengers.invalid)
      .withContext('max passengers must be filled')
      .toBeFalsy();

    expect(component['publishForm'].controls.price.invalid)
      .withContext('price must be filled')
      .toBeFalsy();

    expect(component['publishForm'].controls.departure_time.invalid)
      .withContext('departure time must be filled')
      .toBeFalsy();

    expect(button.disabled)
      .withContext(
        'All required filled must be filled, at least one is missing to enable the button',
      )
      .toBeFalsy();

    expect(spyCarpoolingService.publish.calls.count())
      .withContext('getAddressByString must be called once')
      .toEqual(1);
  });

  it('should invalidate input when the departure autosuggestion is not selected', async () => {
    const inputDebugElement = fixture.debugElement.query(
      By.css('#starting_point_id'),
    );

    await inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = '1 rue ';
    await inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component['publishForm'].controls.starting_point.invalid)
      .withContext(
        'departure should be invalid when not selecting the autosuggestion',
      )
      .toBeTruthy();
  });

  it('should invalidate input when the destination autosuggestion is not selected', async () => {
    const inputDebugElement = fixture.debugElement.query(
      By.css('#destination_id'),
    );

    await inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = '1 rue ';
    await inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component['publishForm'].controls.destination.invalid)
      .withContext(
        'destination should be invalid when not selecting the autosuggestion',
      )
      .toBeTruthy();
  });

  it('should invalidate input when the date is not valid', async () => {
    await selectDate('2014-12-11T23:00:00.000Z');

    expect(component['publishForm'].controls.departure_date.invalid)
      .withContext(
        'departure date should be invalid when select a date in the past',
      )
      .toBeTruthy();
  });

  it('should invalidate input when the max passengers is not valid', async () => {
    await selectPassager(0);

    expect(component['publishForm'].controls.max_passengers.invalid)
      .withContext('max passengers should be invalid when < 1')
      .toBeTruthy();

    await selectPassager(11);

    expect(component['publishForm'].controls.max_passengers.invalid)
      .withContext('max passengers should be invalid when > 4')
      .toBeTruthy();
  });

  it('should invalidate input when the price is not valid', async () => {
    await selectPrice(-1);

    expect(component['publishForm'].controls.price.invalid)
      .withContext('price should be invalid when <= 0')
      .toBeTruthy();
  });

  it('should notify the user when he successfullly published a carpool', async () => {
    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;

    spyCarpoolingService.publish.and.returnValue(of({ status: 200, data: {} }));

    spyAddressService.getAddressByString.and.returnValue(
      of([
        {
          address: {
            house_number: '1',
            city: 'Marseille',
            road: 'Rue de la République',
            postcode: '13001',
          },
        },
      ]),
    );

    await fillForm();

    expect(spyNotifierService.success)
      .withContext('should notify the user')
      .toHaveBeenCalled();
    expect(button.disabled).toBeFalsy();
  });

  it('should notify the user once when API return HTTP error', async () => {
    const button = fixture.debugElement.query(
      By.css('#publish_id'),
    ).nativeElement;
    spyAddressService.getAddressByString.and.returnValue(
      of([
        {
          address: {
            house_number: '1',
            city: 'Marseille',
            road: 'Rue de la République',
            postcode: '13001',
          },
        },
      ]),
    );

    spyCarpoolingService.publish.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Field missing',
            status: 400,
          }),
      ),
    );

    await fillForm();

    expect(spyNotifierService.error)
      .withContext('should notify the user field missing')
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.publish.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Bad role',
            status: 401,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext(
        'should notify the user he is not authorized to publish a carpool',
      )
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.publish.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Driver role not yet assigned',
            status: 403,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext(
        'should notify the user he is not yet authorized to publish a carpool',
      )
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.publish.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Internal server error',
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext('should notify the user of an internal server error')
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);
  });
});
