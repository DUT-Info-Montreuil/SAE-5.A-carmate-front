import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faMale, faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from '../../../interface/other';
import { HttpErrorResponse } from '@angular/common/http';
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface } from '../../../interface/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  protected readonly faUser = faUser;
  protected readonly faMale = faMale;
  protected readonly faLock = faLock;
  protected readonly faEnvelope = faEnvelope;
  protected signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
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

    // Reset API error for the UI on input change
    this.email?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });

    this.password?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });
  }

  submit() {
    // Vérifiez la correspondance des mots de passe ici
    if (this.password?.value !== this.confirmPassword?.value) {
      // Gérez l'erreur de non-correspondance des mots de passe ici
      return;
    }
  
    this.authService.signup(
      this.firstName?.value ?? '',
      this.lastName?.value ?? '',
      this.email?.value ?? '',
      this.password?.value ?? '',
      this.confirmPassword?.value ?? ''
    ).subscribe({
      next: () => {
        this.redirect();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("L'email ou le mot de passe est invalide.");
          this.needsToChangeAField = true;
        } else if (error.status === 403) {
          this.notifier.error("Ce compte est banni.");
        }
      }
    });
  }
  

  private redirect() {
    this.router.navigate([this.redirection || '/']);
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
}
