import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../interface/other';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
  Token,
} from '../../../interface/user';
import { BehaviorSubject, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let spyAuthService: jasmine.SpyObj<AuthenticationServiceInterface>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let queryParams: BehaviorSubject<any>;

  beforeEach(async () => {
    spyAuthService = jasmine.createSpyObj('AuthenticationServiceInterface', [
      'register',
    ]);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
      'success',
      'warning',
    ]);
    queryParams = new BehaviorSubject({});
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: Router, useValue: spyRouterService },
        { provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthService },
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
