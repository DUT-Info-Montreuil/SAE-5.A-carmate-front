import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../interface/other";
import {PROFILE_SERVICE_TOKEN, ProfilesServiceInterface} from "../../interface/profiles";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-become-driver',
  templateUrl: './become-driver.component.html',
  styleUrls: ['./become-driver.component.scss']
})
export class BecomeDriverComponent {
  protected form = new FormGroup({
    file: new FormControl(null, [Validators.required]),
  });
  private formData: FormData | undefined;
  constructor(
    private router: Router,
    @Inject(PROFILE_SERVICE_TOKEN) private profileService: ProfilesServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.formData = new FormData();
    this.formData.append('document', file);
  }

  submit() {
    if (this.form.invalid) {
      this.notifier.warning("Veuillez remplir tous les champs correctement.");
      return;
    }

    this.profileService.becomeDriver(this.formData!).subscribe({
      next: () => {
        this.notifier.success("La pièce justificative est en cours de vérification...");
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("Vous n'etes pas connecté");
          this.router.navigate(['/login']);
        } else if(error.status === 403) {
          this.notifier.error("Ce compte est banni.");
          this.router.navigate(['/home']);
        } else if(error.status === 404) {
          this.notifier.error("Votre compte n'a pas été trouvé.");
          this.router.navigate(['/login']);
        } else if (error.status === 409) {
          this.notifier.error("Vous êtes déjà un conducteur.");
          this.router.navigate(['/home']);
        } else if(error.status === 415) {
          this.notifier.error("Le fichier n'a pas le bon format, seul les fichiers .png, .jpg et jpeg sont acceptés.");
        } else {
          this.notifier.error("Erreur interne.");
        }
      }
    });
  }
}
