import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Carpooling, CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, Search } from 'src/app/interface/carpooling';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { SCORE_SERVICE_TOKEN, ScoreServiceInterface, ScoreUserData } from 'src/app/interface/score';

@Component({
  selector: 'app-carpooling-dialog',
  templateUrl: './carpooling-dialog.component.html',
  styleUrls: ['./carpooling-dialog.component.scss'],
})
export class CarpoolingDialogComponent {
  _driverScore!: ScoreUserData;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {carpooling: Carpooling, _searchParams: Search},
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
    @Inject(SCORE_SERVICE_TOKEN) private scoreboardService: ScoreServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    public dialogRef: MatDialogRef<CarpoolingDialogComponent>,
  ) {}

  ngOnInit() {
    this.scoreboardService.getScoreUserData(this.data.carpooling.driver_id).subscribe({
      next: (score) => {
        console.log(score);
        
        this._driverScore = score as ScoreUserData;
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 500:
            this.notifier.error("Erreur interne.");
            break;
          case 503:
            this.notifier.error("Service momentanément indisponible.");
            break;
          default:
            this.notifier.error("Erreur inconnue.");
            break;
        }
      }
    });    
  }

  onClose(): void {
    this.dialogRef.close();
  }

  submit(): void {
    console.log(this.data.carpooling.id, this.data.carpooling.is_scheduled, parseInt(this.data._searchParams.departure_date_time));
    
    this.carpoolingService.book(this.data.carpooling.id, this.data.carpooling.is_scheduled, parseInt(this.data._searchParams.departure_date_time)).subscribe({
      next: () => {
        this.dialogRef.close();
        this.notifier.success("Réservation effectuée avec succès");
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.notifier.error("Vous n'êtes pas autorisé à effectuer cette action.");
            break;
          case 403:
            this.notifier.error("Vous 'n'êtes plus autorisé à éffectuer cette action");
            break;
          case 404:
            this.notifier.error("Le covoiturage n'existe pas.");
            break;
          case 409:
            this.notifier.error("Un problème est survenu dans la réservation du covoiturage."); 
            break;
          case 410:
            this.notifier.error("Le covoiturage a été annulé.");
            break;
          case 423:
            this.notifier.error("La prise en charge de ce covoiturage est passée.");
            break;
          case 500:
            this.notifier.error("Erreur interne.");
            break;
          case 503:
            this.notifier.error("Service momentanément indisponible.");
            break;
          default:
            this.notifier.error("Erreur inconnue.");
            break;
        }
      }
  });
  }
}