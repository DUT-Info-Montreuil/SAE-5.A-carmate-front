import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValidationComponent } from './validation_list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../../interface/notifier.interface';
import {
  ValidationServiceInterface,
  VALIDATION_SERVICE_TOKEN,
} from 'src/app/interface/admin.interface';

describe('validationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyValidListeService: jasmine.SpyObj<ValidationServiceInterface>;
  let queryParams: BehaviorSubject<any>;

  beforeEach(async () => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
      'success',
      'warning',
    ]);
    queryParams = new BehaviorSubject({});
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);
    spyValidListeService = jasmine.createSpyObj('ValidationServiceInterface', [
      'getListDocumentToValidate',
    ]);
    spyValidListeService.getListDocumentToValidate.and.returnValue(of({}));
    await TestBed.configureTestingModule({
      declarations: [ValidationComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FontAwesomeModule,
      ],
      providers: [
        { provide: Router, useValue: spyRouterService },
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        { provide: VALIDATION_SERVICE_TOKEN, useValue: spyValidListeService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams.asObservable() },
        },
      ],
    })
      .overrideProvider(ActivatedRoute, {
        useValue: { queryParams: queryParams.asObservable() },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
