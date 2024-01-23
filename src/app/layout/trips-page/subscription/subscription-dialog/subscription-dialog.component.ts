import { HttpErrorResponse } from '@angular/common/http';
import { NotExpr } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CARPOOLING_SERVICE_TOKEN,
  CarpoolingServiceInterface,
} from 'src/app/interface/carpooling.interface';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from 'src/app/interface/notifier.interface';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss'],
})
export class SubscriptionDialogComponent {
  _carpoolingId!: number;
  code!: number[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    @Inject(CARPOOLING_SERVICE_TOKEN)
    private carpoolingService: CarpoolingServiceInterface,
  ) {}

  ngOnInit(): void {
    this._carpoolingId = this.data.id;
    this.carpoolingService.getCode(this._carpoolingId).subscribe({
      next: (code) => {
        this.code = Array.from(code.toString()).map(Number);
      },
      error: (error: HttpErrorResponse) => {
        switch (
          error.status //TODO
        ) {
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
