import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishedCarpoolingDialogComponent } from './published-carpooling-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import {
  CarpoolingServiceInterface,
  CARPOOLING_SERVICE_TOKEN,
} from 'src/app/interface/carpooling.interface';
import {
  NotifierServiceInterface,
  NOTIFIER_SERVICE_TOKEN,
} from 'src/app/interface/notifier.interface';

describe('PublishedCarpoolingDialogComponent', () => {
  let component: PublishedCarpoolingDialogComponent;
  let fixture: ComponentFixture<PublishedCarpoolingDialogComponent>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  const carpooling_id = 1;
  beforeEach(() => {
    spyDialog = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'success',
      'error',
    ]);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', [
      'postCode',
    ]);
    TestBed.configureTestingModule({
      declarations: [PublishedCarpoolingDialogComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: MatDialog, useValue: spyDialog },
        { provide: MAT_DIALOG_DATA, useValue: carpooling_id },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        { provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService },
      ],
    });
    fixture = TestBed.createComponent(PublishedCarpoolingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize _carpoolingId on ngOnInit', () => {
    component.data = { id: carpooling_id };
    component.ngOnInit();
    expect(component._carpoolingId).toEqual(carpooling_id);
  });
});
