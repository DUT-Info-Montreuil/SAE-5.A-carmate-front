import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { faMale, faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from '../../../interface/other';
import { HttpErrorResponse } from '@angular/common/http';
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface } from '../../../interface/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  protected readonly faUser = faUser;
  protected readonly faMale = faMale;
  protected readonly faLock = faLock;
  protected readonly faEnvelope = faEnvelope;
  protected registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    accountType: new FormControl('', [Validators.required]),
    document: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), this.createPasswordStrengthValidator()]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  private redirection: string | undefined;
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

    this.email?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });

    this.password?.valueChanges.subscribe(() => {
      this.needsToChangeAField = false;
    });
  }

  submit() {
    if (!this.arePasswordsMatching()) {
      this.notifier.error("Les mots de passe ne correspondent pas.");
      return;
    }
  
    if (this.registerForm.invalid) {
      this.notifier.error("Veuillez remplir tous les champs correctement.");
      return;
    }
  
    this.registerUser();
  }

  private createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        return !passwordValid ? {passwordStrength:true}: null;
    }
}
  
  private arePasswordsMatching(): boolean {
    return this.password?.value === this.confirmPassword?.value;
  }
  
  private registerUser() {
    const accountType = this.registerForm.get('accountType')?.value;
    const document = this.registerForm.get('document')?.value;

    if (
      accountType !== null && accountType !== undefined &&
      document !== null && document !== undefined
    ) {
      this.authService.register(
        this.firstName?.getRawValue(),
        this.lastName?.getRawValue(),
        this.email?.getRawValue(),
        this.password?.getRawValue(),
        accountType,
        document as File
      ).subscribe({
        next: () => {
          this.redirect();
        },
        error: (error: HttpErrorResponse) => {
          this.handleRegistrationError(error);
        }
      });
    } else {
      if (accountType === null || accountType === undefined) {
        this.notifier.error("Le type de compte est manquant.");
      } else if (document === null || document === undefined) {
        this.notifier.error("Le document est manquant.");
      } else {
        console.error("accountType ou document est null ou undefined");
      }
    }
  }

  private handleRegistrationError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        this.notifier.error("Type de compte invalide, donnée manquante ou prénom/nom de famille trop long.");
        break;
      case 409:
        this.notifier.error("L'utilisateur existe déjà.");
        break;
      case 415:
        this.notifier.error("Donnée invalide.");
        break;
      case 500:
        this.notifier.error("Exception non gérée.");
        break;
      default:
        this.notifier.error("Erreur inattendue.");
        break;
    }
  }

  private redirect() {
    this.router.navigate([this.redirection || '/']);
  }
  
  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
