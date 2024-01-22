import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSubscriptionComponent } from './create-subscription.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
} from '../../interface/user.interface';
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

describe('CreateSubscriptionComponent', () => {
  let component: CreateSubscriptionComponent;
  let fixture: ComponentFixture<CreateSubscriptionComponent>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyAuthenticationService: jasmine.SpyObj<AuthenticationServiceInterface>;

  const selectLabel = async (inputUser: string) => {
    component['subForm'].controls.label.setValue(inputUser);
    await fixture.whenStable();
    fixture.detectChanges();
  };

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

  const selectDateRange = async (inputUser: string[]) => {
    component['subForm'].controls.date_start.setValue(inputUser[0]);
    component['subForm'].controls.date_end.setValue(inputUser[1]);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const selectDays = async (inputUser: string[]) => {
    fixture.debugElement
      .query(By.css('mat-select'))
      .injector.get(MatSelect)
      .open();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');

    inputUser.forEach(async (userInput) => {
      for (let i = 0; i < matOptions.length; i++) {
        const matOption = matOptions[i] as HTMLElement;
        const optionValue: string = matOption.textContent?.trim()!;

        if (userInput === optionValue) {
          matOption.click();
          await fixture.whenStable();
          fixture.detectChanges();
        }
      }
    });
  };

  const selectTime = async (inputUser: string) => {
    component['subForm'].controls.start_hour.setValue(inputUser);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const fillForm = async () => {
    const button = fixture.debugElement.query(By.css('#sub_id')).nativeElement;
    await selectLabel('test');
    await selectDepartureFirstSuggestion('1 rue');
    await selectDestinationFirstSuggestion('1 rue');
    await selectDateRange([
      '2024-03-05T12:00:00.000Z',
      '2024-04-11T23:00:00.000Z',
    ]);
    await selectDays(['Lundi', 'Mardi']);
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
      'createSubscription',
      'createSubscription',
    ]);
    spyAuthenticationService = jasmine.createSpyObj(
      'AuthenticationServiceInterface',
      ['isDriver'],
    );
    TestBed.configureTestingModule({
      declarations: [CreateSubscriptionComponent],
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
        MatSelectModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        { provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService },
        { provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService },
        {
          provide: AUTHENTICATION_SERVICE_TOKEN,
          useValue: spyAuthenticationService,
        },
      ],
    });
    fixture = TestBed.createComponent(CreateSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when all required field value are missing', () => {
    const button = fixture.debugElement.query(By.css('#sub_id')).nativeElement;
    expect(button.disabled)
      .withContext('submit button should be disabled')
      .toBeTruthy();
  });

  it('should enable the submit button when fill in correctly', async () => {
    const button = fixture.debugElement.query(By.css('#sub_id')).nativeElement;

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

    spyCarpoolingService.createSubscription.and.returnValue(of(''));

    await fillForm();

    expect(component['subForm'].controls.label.invalid)
      .withContext('label must be filled')
      .toBeFalsy();

    expect(component['subForm'].controls.starting_point.invalid)
      .withContext('departure must be filled')
      .toBeFalsy();

    expect(component['subForm'].controls.destination.invalid)
      .withContext('destination must be filled')
      .toBeFalsy();

    expect(component['subForm'].controls.date_start.invalid)
      .withContext('date_start must be filled')
      .toBeFalsy();

    expect(component['subForm'].controls.date_end.invalid)
      .withContext('date_end must be filled')
      .toBeFalsy();

    expect(component['subForm'].controls.days.invalid)
      .withContext('days must be filled')
      .toBeFalsy();

    expect(button.disabled)
      .withContext(
        'All required filled must be filled, at least one is missing to enable the button',
      )
      .toBeFalsy();

    expect(spyCarpoolingService.createSubscription.calls.count())
      .withContext('search must be called once')
      .toEqual(1);
  });

  it('should invalidate input when the departure autosuggestion is not selected', async () => {
    const inputDebugElement = fixture.debugElement.query(
      By.css('#starting_point_id'),
    );

    await inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = '1 rue ';
    await inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component['subForm'].controls.starting_point.invalid)
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

    expect(component['subForm'].controls.destination.invalid)
      .withContext(
        'destination should be invalid when not selecting the autosuggestion',
      )
      .toBeTruthy();
  });

  it('should invalidate input when start date is in past and end date correct', async () => {
    await selectDateRange([
      '2014-12-11T23:00:00.000Z',
      '2024-04-11T23:00:00.000Z',
    ]);

    expect(component['subForm'].controls.date_start.invalid)
      .withContext('start date should be invalid when select date in the past')
      .toBeTruthy();

    expect(component['subForm'].controls.date_end.invalid)
      .withContext('end date should be valid when select correct date')
      .toBeFalsy();
  });

  it('should invalidate input when start date is a Saturday or Sunday and end date correct', async () => {
    await selectDateRange([
      '2024-01-06T23:00:00.000Z',
      '2024-04-11T23:00:00.000Z',
    ]);

    expect(component['subForm'].controls.date_start.invalid)
      .withContext('start date should be invalid when start date is a Saturday')
      .toBeTruthy();

    expect(component['subForm'].controls.date_end.invalid)
      .withContext('end date should be valid when select correct date')
      .toBeFalsy();
  });

  it('should invalidate input when end date is before start date', async () => {
    await selectDateRange([
      '2024-12-11T23:00:00.000Z',
      '2024-04-11T23:00:00.000Z',
    ]);

    expect(component['subForm'].controls.date_start.invalid)
      .withContext(
        'departure date should be invalid when select start date after end date',
      )
      .toBeTruthy();

    expect(component['subForm'].controls.date_end.invalid)
      .withContext(
        'destination date should be invalid when select end date before start date',
      )
      .toBeTruthy();
  });

  it('should notify the user when he successfullly created a subscription', async () => {
    const button = fixture.debugElement.query(By.css('#sub_id')).nativeElement;

    spyCarpoolingService.createSubscription.and.returnValue(
      of({ status: 200 }),
    );

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
    const button = fixture.debugElement.query(By.css('#sub_id')).nativeElement;

    spyCarpoolingService.createSubscription.and.returnValue(
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

    spyCarpoolingService.createSubscription.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Token expired',
            status: 401,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext(
        'should notify the user he is not authorized to createSubscription a carpool',
      )
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.createSubscription.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'You do not have access to this content',
            status: 403,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext(
        'should notify the user he is not yet authorized to createSubscription a carpool',
      )
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.createSubscription.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error:
              'Unable to create: \
      This subscription conflicts with a reservation or another subscription',
            status: 409,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext('should notify the user the subscription conflicts')
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.createSubscription.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Unknown error',
            status: 500,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext('should notify the user of an Unknow error')
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.createSubscription.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Service temporarily unavailable.',
            status: 503,
          }),
      ),
    );

    button.click();

    expect(spyNotifierService.error)
      .withContext(
        'should notify the user ths Service is temporarily unavailable.',
      )
      .toHaveBeenCalled();
    expect(spyNotifierService.error.calls.count())
      .withContext('notify must be called once')
      .toEqual(1);

    spyNotifierService.error.calls.reset();

    spyCarpoolingService.createSubscription.and.returnValue(
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
