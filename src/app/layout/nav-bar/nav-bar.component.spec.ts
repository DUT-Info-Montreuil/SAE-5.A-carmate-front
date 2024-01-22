import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface} from "../../interface/user.interface";
import { RouterTestingModule } from "@angular/router/testing";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Router} from "@angular/router";

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let spyAuthService: jasmine.SpyObj<AuthenticationServiceInterface>;
  let router: Router;

  beforeEach(() => {
    spyAuthService = jasmine.createSpyObj('AuthenticationServiceInterface', [
      'login',
      'logOut',
      'isLogged',
      'isAdmin',
      'isDriver',
      'register',
    ]);
    TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [
        { provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthService },
      ],
    });
    fixture = TestBed.createComponent(NavBarComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
