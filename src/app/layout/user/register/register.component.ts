import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  faMale,
  faLock,
  faEnvelope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../interface/other';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
} from '../../../interface/user';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Icons
  protected readonly faUser = faUser;
  protected readonly faMale = faMale;
  protected readonly faLock = faLock;
  protected readonly faEnvelope = faEnvelope;

  private redirection: string | undefined;

  // File Input properties
  private readonly maxSize: number = 8;
  protected readonly multiple: boolean = false;
  protected readonly accept: string = '.png, .jpg, .jpeg';
  protected readonly color: ThemePalette = 'primary';

  protected registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    document: new FormControl<File>(new File([], 'Placez votre fichier ici'), [
      Validators.required,
      MaxSizeValidator(this.maxSize * Math.pow(10, 6)),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.createPasswordStrengthValidator(),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    accountType: new FormControl('Student', []),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTHENTICATION_SERVICE_TOKEN)
    private authService: AuthenticationServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.redirection = params.redirect;
    });

    this.document.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.document.setValue(files);
      } else {
        this.document.setValue(files[0]);
      }
    });
  }

  submit() {
    if (!this.arePasswordsMatching()) {
      this.notifier.error('Les mots de passe ne correspondent pas.');
      return;
    }

    if (this.registerForm.invalid) {
      this.notifier.error('Veuillez remplir tous les champs correctement.');
      return;
    }

    const accountType = 'Student';
    if (accountType && this.document?.value) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.document.value);
      reader.onload = () => {
        const result: string | ArrayBuffer | null = reader.result;
        if (result !== null && this.document?.value) {
          const blob = new Blob([result], { type: this.document.value.type });
          this.authService
            .register(this.registerForm, blob, this.document.value.name)
            .subscribe({
              next: () => {
                this.redirect();
              },
              error: (error: HttpErrorResponse) => {
                this.handleRegistrationError(error);
              },
            });
        }
      };
    } else {
      if (!accountType) {
        this.notifier.error('Le type de compte est manquant.');
      } else if (!document) {
        this.notifier.error('Le document est manquant.');
      } else {
        console.error('accountType ou document est null ou undefined');
      }
    }
  }

  private createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChars = /[^A-Za-z0-9\s]+/.test(value);
      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChars;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  private arePasswordsMatching(): boolean {
    return this.password?.value === this.confirmPassword?.value;
  }

  private handleRegistrationError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        this.notifier.error(
          'Type de compte invalide, donnée manquante ou prénom/nom de famille trop long.',
        );
        break;
      case 409:
        this.notifier.error("L'utilisateur existe déjà.");
        break;
      case 415:
        this.notifier.error('Donnée invalide.');
        break;
      case 500:
        this.notifier.error('Exception non gérée.');
        break;
      default:
        this.notifier.error('Erreur inattendue.');
        break;
    }
  }

  private redirect() {
    this.router.navigate([this.redirection || '/home']);
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

  get document(): FormControl<File> {
    return this.registerForm.get('document') as FormControl<File>;
  }
}
