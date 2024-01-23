import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CARPOOLING_SERVICE_TOKEN,
  CarpoolingServiceInterface,
} from 'src/app/interface/carpooling';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from 'src/app/interface/other';

@Component({
  selector: 'app-published-carpooling-dialog',
  templateUrl: './published-carpooling-dialog.component.html',
  styleUrls: ['./published-carpooling-dialog.component.scss'],
})
export class PublishedCarpoolingDialogComponent {
  _carpoolingId!: number;
  input: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{6}$'),
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    @Inject(CARPOOLING_SERVICE_TOKEN)
    private carpoolingService: CarpoolingServiceInterface,
    public dialogRef: MatDialogRef<PublishedCarpoolingDialogComponent>,
  ) {}

  ngOnInit(): void {
    this._carpoolingId = this.data.id;
  }

  checkInputLength(event: any) {
    if (event.target.value.length >= 6) {
      event.target.blur();
      this.carpoolingService
        .postCode(parseInt(event.target.value), this._carpoolingId)
        .subscribe({
          next: () => {
            this.notifier.success('Code validé !');
            this.dialogRef.close();
          },
          error: (error: HttpErrorResponse) => {
            switch (error.status) {
              case 400:
                this.notifier.error('Code invaide.');
                break;
              case 401:
                this.notifier.error('Veuillez vous reconnecter.');
                break;
              case 403:
                this.notifier.error(
                  "Le rôle de conducteur n'est pas encore validé.",
                );
                break;
              case 404:
                this.notifier.error('Code invalide.');
                break;
              case 410:
                this.notifier.error('Code confirmé trop tard ou trop tôt.');
                break;
              case 500:
                this.notifier.error('Erreur interne.');
                break;
              case 503:
                this.notifier.error('Service momentanément indisponible.');
                break;
              default:
                this.notifier.error('Erreur interne.');
                break;
            }
          },
        });
    }
  }
}
