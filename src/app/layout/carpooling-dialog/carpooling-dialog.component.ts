import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Carpooling, CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from 'src/app/interface/carpooling';

@Component({
  selector: 'app-carpooling-dialog',
  templateUrl: './carpooling-dialog.component.html',
  styleUrls: ['./carpooling-dialog.component.scss'],
})
export class CarpoolingDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Carpooling,
    @Inject(CARPOOLING_SERVICE_TOKEN)
    public carpoolingService: CarpoolingServiceInterface,
    public dialogRef: MatDialogRef<CarpoolingDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.carpoolingService.book(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}