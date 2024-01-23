import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarpoolingDialogComponent } from './carpooling-dialog.component';
import {
  MatDialogModule,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  CarpoolingServiceInterface,
  CARPOOLING_SERVICE_TOKEN,
} from 'src/app/interface/carpooling';
import {
  NotifierServiceInterface,
  NOTIFIER_SERVICE_TOKEN,
} from 'src/app/interface/other';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CarpoolingDialogComponent', () => {
  let component: CarpoolingDialogComponent;
  let fixture: ComponentFixture<CarpoolingDialogComponent>;
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
      'getCode',
      'getPublishedSubscriptions',
    ]);
    spyCarpoolingService.getCode.and.returnValue(of(123456));
    spyCarpoolingService.getPublishedSubscriptions.and.returnValue(of([]));
    TestBed.configureTestingModule({
      declarations: [CarpoolingDialogComponent],
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
    fixture = TestBed.createComponent(CarpoolingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
