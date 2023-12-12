import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { PublishCarpoolComponent } from './publish-carpool.component';
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../interface/other";
import { Router } from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatInput, MatInputModule} from '@angular/material/input';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RootComponent} from "../root/root.component";

describe('PublishCarpoolComponent', () => {
  let component: PublishCarpoolComponent;
  let fixture: ComponentFixture<PublishCarpoolComponent>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
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
