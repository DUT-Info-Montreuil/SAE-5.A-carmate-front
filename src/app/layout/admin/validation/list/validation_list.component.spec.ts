/*import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ValidationComponent} from './validation_list.component';
import {ActivatedRoute, Router} from "@angular/router";
import {VALIDATION_LIST_SERVICE_TOKEN, UserToValidateInterface, UserInterface} from "../../../../interface/admin";
import {BehaviorSubject, of, throwError} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
import {HttpErrorResponse} from "@angular/common/http";
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../../../interface/other";


describe('validationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;
  let spyValidateService: jasmine.SpyObj<UserToValidateInterface>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let queryParams: BehaviorSubject<any>;
  const returnList: UserInterface[] = [
    {first_name:"Chong", last_name:"McTiesan", published_at: new Date('11/11/2022'),licence_type: "student",  document:""},
    {first_name:"Johny", last_name:"Sins", published_at: new Date('11/11/2022'),licence_type: "student",  document:""},
    {first_name:"Kulanga", last_name:"Biche", published_at: new Date('11/11/2022'),licence_type: "teacher",  document:""},
    {first_name:"Mokangua", last_name:"TéléGama", published_at: new Date('11/11/2022'),licence_type: "student",  document:""},
    {first_name:"Babagewoski", last_name:"Piotr", published_at: new Date('11/11/2022'),licence_type: "student",  document:""},
  ];

  const setUser = (type: string, first_name: string, lastName:string, date:Date) => {
    component["loginForm"].controls.email.setValue(email);
    component["loginForm"].controls.password.setValue(password);
  }

beforeEach(async () => {
    spyValidateService = jasmine.createSpyObj('UserToValidateInterface', ['getListValidation']);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    queryParams = new BehaviorSubject({});
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ValidationComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FontAwesomeModule
      ],
      providers: [
        {provide: Router, useValue: spyRouterService},
        {provide: VALIDATION_LIST_SERVICE_TOKEN, useValue: spyValidateService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
        {
          provide: ActivatedRoute,
          useValue: {queryParams: queryParams.asObservable()}
        }
      ]
    }).overrideProvider(ActivatedRoute, {useValue: {queryParams: queryParams.asObservable()}})
      .compileComponents();
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getListValidation method on init', () => {
    spyValidateService.getListValidation.and.returnValue(of(returnList))
    setEmailAndPassword(validUser.email, validUser.password);
    component.ngOnInit();

    expect(spyAuthService.login.calls.mostRecent().args).toEqual([validUser.email, validUser.password])
  });

  it('should call login with redirectTo if there are query params', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(of(returnToken))
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyAuthService.login.calls.count()).toEqual(1)
    expect(spyAuthService.login.calls.mostRecent().args).toEqual([validUser.email, validUser.password])
  });

  it('should set submit enabled if the email and password format are valid', () => {
    setEmailAndPassword(validUser.email, validUser.password);
    fixture.detectChanges()

    expect(component["loginForm"].invalid).toBeFalsy();
    expect(component["needsToChangeAField"]).toBeFalsy();
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.disabled).toBeFalsy();
  })


  it('should not set submit enabled if the email format is invalid', () => {
    const testUser = {email: "testInvalidEmailFormat", password: 'password123'}
    setEmailAndPassword(testUser.email, testUser.password);
    fixture.detectChanges();


    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(component["loginForm"].controls.email.invalid).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  })

  it('should not set submit enabled if the password format is invalid', () => {
    const testUser = {email: "test@example.com", password: 'low'}
    setEmailAndPassword(testUser.email, testUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(component["loginForm"].controls.password.invalid).toBeTrue()
    expect(button.disabled).toBeTruthy();
  });

  it('should notify the user if the email is not recognized and button should be disabled', () => {
    spyAuthService.login.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'Email or password invalid',
      status: 401
    })))
    setEmailAndPassword(validUser.email, validUser.password);

    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled()
    expect(button.disabled).toBeTruthy();
    expect(component["needsToChangeAField"]).toBeTruthy();
  });

  it('should notify the user if the password is wrong and button should be disabled', () => {
    spyAuthService.login.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'Email or password invalid',
      status: 401
    })))
    setEmailAndPassword(validUser.email, validUser.password);
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled()
    expect(button.disabled).toBeTruthy();
    expect(component["needsToChangeAField"]).toBeTruthy();
  });

  it('should notify the user when he is banned', () => {
    spyAuthService.login.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'User is banned',
      status: 403
    })))
    setEmailAndPassword(validUser.email, validUser.password);
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled()
    expect(button.disabled).toBeFalsy();
    expect(component["needsToChangeAField"]).toBeFalsy();
  });

  it('should redirect the user to the home page if he is logged', () => {
    spyAuthService.isLogged.and.returnValue(true);
    fixture.detectChanges();

    expect(spyAuthService.isLogged).toHaveBeenCalled();
    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([['/']]);
  });

  it('should redirect the user to the redirect page query if he is logged', () => {
    spyAuthService.isLogged.and.returnValue(true);
    queryParams.next({redirect: '/redirect'});
    fixture.detectChanges();

    expect(spyAuthService.isLogged).toHaveBeenCalled();
    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([['/redirect']]);
  });

  it('should redirect the user after a successful login', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(of(returnToken))
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([['/']]);
  });

  it('should not redirect the user after a failed login', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'User is banned',
      status: 403
    })))
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyRouterService.navigate).not.toHaveBeenCalled();
  });


});*/