import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {RootComponent} from './root.component';
import {NotifierModule} from "angular-notifier";
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../interface/other";
import {AUTHENTICATION_SERVICE_TOKEN} from "../../interface/user";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let spyAuthenticationService: jasmine.SpyObj<NotifierServiceInterface>;

  beforeEach(async () => {
    spyAuthenticationService = jasmine.createSpyObj('AuthenticationServiceInterface', ['login', 'logOut', 'isLogged', 'isAdmin', 'isDriver', 'register']);
    await TestBed.configureTestingModule({
      declarations: [RootComponent, NavBarComponent],
      imports: [
        RouterTestingModule,
        NotifierModule,
        FontAwesomeModule
      ],
      providers: [
        {provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthenticationService},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
