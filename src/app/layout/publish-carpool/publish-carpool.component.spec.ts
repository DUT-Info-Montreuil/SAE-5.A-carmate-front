import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from "../../interface/other";
import { PublishCarpoolComponent } from './publish-carpool.component';
import { CarpoolingServiceInterface } from "src/app/interface/carpooling";
import { CARPOOLING_SERVICE_TOKEN } from "src/app/interface/carpooling";
import { ADDRESS_SERVICE_TOKEN } from "../../interface/other";

describe('PublishCarpoolComponent', () => {
  let component: PublishCarpoolComponent;
  let fixture: ComponentFixture<PublishCarpoolComponent>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['search', 'find', 'matchingSchoolDeparture']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['publish'])
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
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService}
      ]
    });
    fixture = TestBed.createComponent(PublishCarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
