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
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from "src/app/interface/carpooling";
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from "../../interface/other";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;

  beforeEach(() => {
    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['search']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['publish'])
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    TestBed.configureTestingModule({
      declarations: [HomePageComponent, SearchBarComponent],
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
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
