import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, RatingPayload } from '../interface/carpooling';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss']
})
export class RatingDialogComponent {
  protected ratingForm = new FormGroup({
    economic_driving_rating: new FormControl(0, [Validators.required]),
    safe_driving_rating: new FormControl(0, [Validators.required]),
    sociability_rating: new FormControl(0, [Validators.required]),
    comment: new FormControl('')
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    @Inject(CARPOOLING_SERVICE_TOKEN) protected carpoolingService: CarpoolingServiceInterface,
  ) { }

  submitRating() {
    let payload: RatingPayload = {
      id_carpooling: this.data.id,
      economic_driving_rating: this.ratingForm.get('economic_driving_rating')!.value!,
      safe_driving_rating: this.ratingForm.get('safe_driving_rating')!.value!,
      sociability_rating: this.ratingForm.get('sociability_rating')!.value!,
    }
    this.carpoolingService.rate(payload).subscribe({
      next: () => {
        console.log(payload);
      },
      error: () => {
        //TODO
      }
    });
  }

}