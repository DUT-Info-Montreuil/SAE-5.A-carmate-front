import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faMale, faLock, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute, Router} from '@angular/router';
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../../interface/other";
import {HttpErrorResponse} from "@angular/common/http";
import {AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface} from "../../../interface/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  protected readonly faMale = faMale;
  protected readonly faLock = faLock;
  protected readonly faEnvelope = faEnvelope;

  protected loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });
  private redirection: undefined | string;
  protected needsToChangeAField = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTHENTICATION_SERVICE_TOKEN) private authService: AuthenticationServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.redirection = params.redirect;
    });

    if (this.authService.isLogged()) {
      this.notifier.warning("Vous êtes déjà connecté.");
      this.redirect();
    }
    
    // Reset api error for the IHM on input change
    this.email?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });

    this.password?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });
  }

  submit() {
    this.authService.login(this.email?.getRawValue(), this.password?.getRawValue()).subscribe({
      next: () => {
        this.redirect();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("L'email ou mot de passe est invalide.");
          this.needsToChangeAField = true;
        } else if (error.status === 403) {
          this.notifier.error("Ce compte est banni.");
        } else {
          this.notifier.error("Erreur interne.");
        }
      }
    });
  }

  private redirect() {
    this.router.navigate([this.redirection || '/']);
  }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }
}
