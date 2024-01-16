import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from "src/app/interface/carpooling";
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NotifierServiceInterface } from "../../interface/other";
import { SearchBarComponent } from './search-bar.component';
import { NOTIFIER_SERVICE_TOKEN } from '../../interface/other';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';


describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;

  const selectDepartureFirstSuggestion = async (inputUser: string) => {
    const inputDebugElement = fixture.debugElement.query(By.css('#starting_point_id'));

    inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = inputUser;
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    component.departureTrigger!.openPanel();

    await fixture.whenStable();
    fixture.detectChanges();

    const matOption = document.querySelector('mat-option') as HTMLElement;

    if (!matOption ||matOption === undefined) {
      fail('No mat-option elements found');
    }
    matOption.click();

    component.departureTrigger!.closePanel();
  }

  const selectDestinationFirstSuggestion = async (inputUser: string) => {
    const inputDebugElement = fixture.debugElement.query(By.css('#destination_id'));

    inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = inputUser;
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    component.destinationTrigger!.openPanel();

    await fixture.whenStable();
    fixture.detectChanges();

    const matOption = document.querySelector('mat-option') as HTMLElement;

    if (!matOption ||matOption === undefined) {
      fail('No mat-option elements found');
    }
    matOption.click();

    component.destinationTrigger!.closePanel();
  }

  const selectDate = async (inputUser: string) => {
    const button = fixture.debugElement.query(By.css('#search_id')).nativeElement;

    component["searchForm"].controls.departure_date.setValue(inputUser);

    await fixture.whenStable();
    fixture.detectChanges();

    button.click();
  }

  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getAddressByString', 'getAddressByCoords', 'matchingSchoolDeparture']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['publish', 'search'])
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
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
      ],
      providers: [
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
      ]
    });
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the button "Rechercher" when all required field value is missing', () => {
    const button = fixture.debugElement.query(By.css('#search_id')).nativeElement;
    expect(button.disabled)
      .withContext('submit button should be disabled when all required field is missing')
      .toBeTruthy();
  });

  it('should disable the button "Rechercher" when at least one required field value is missing', (async () => {
    const button = fixture.debugElement.query(By.css('#search_id')).nativeElement;

    selectDepartureFirstSuggestion('1 rue');

    expect(button.disabled)
      .withContext('submit button should be disabled when at least one required field is missing')
      .toBeTruthy();
  }));

  it('should enbale the sbumit button when selecting the first autocomplete option and filling the date manually', (async () => {
    const button = fixture.debugElement.query(By.css('#search_id')).nativeElement;
    spyAddressService.getAddressByString.and.returnValue(of([{
      lat: 43.296482,
      lon: 5.36978,
      address: {
        house_number: '1',
        city: 'Marseille',
        road: 'Rue de la République',
        postcode: '13001',
      },
    }]));

    await selectDepartureFirstSuggestion('1 rue');

    await selectDestinationFirstSuggestion('1 rue');

    await selectDate("2024-12-11T23:00:00.000Z");

    expect(component["searchForm"].controls.starting_point.invalid)
      .withContext('departure must be filled')
      .toBeFalsy();

    expect(component["searchForm"].controls.destination.invalid)
      .withContext('destination must be filled')
      .toBeFalsy();

    expect(component["searchForm"].controls.departure_date.invalid)
      .withContext('departure date must be filled')
      .toBeFalsy();

    expect(button.disabled)
      .withContext('All required filled must be filled, at least one is missing to enable the button')
      .toBeFalsy();

    expect(spyCarpoolingService.search.calls.count())
      .withContext('search must be called once')
      .toEqual(1);
  }));

  it('should display an error message when the departure autosuggestion is not selected', (async () => {
    const inputDebugElement = fixture.debugElement.query(By.css('#starting_point_id'));

    await inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = '1 rue ';
    await inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component["searchForm"].controls.starting_point.invalid)
      .withContext('departure should be invalid when not selecting the autosuggestion')
      .toBeTruthy();
  }));

  it('should display an error message when the destination autosuggestion is not selected', (async () => {
    const inputDebugElement = fixture.debugElement.query(By.css('#destination_id'));

    await inputDebugElement.nativeElement.dispatchEvent(new Event('focusin'));
    inputDebugElement.nativeElement.value = '1 rue ';
    await inputDebugElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component["searchForm"].controls.destination.invalid)
      .withContext('destination should be invalid when not selecting the autosuggestion')
      .toBeTruthy();
  }));

  it('should display an error message when the date is not valid', (async () => {
    await selectDate("2014-12-11T23:00:00.000Z");

    expect(component["searchForm"].controls.departure_date.invalid)
      .withContext('departure date should be invalid when select a date in the past')
      .toBeTruthy();
  }));

});
