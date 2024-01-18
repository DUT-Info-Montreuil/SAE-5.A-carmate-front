import { CommonModule } from '@angular/common'
import {Component, Inject, NgModule} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from 'src/app/interface/carpooling';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';

@Component({
  selector: 'app-carpooling-dialog',
  templateUrl: './carpooling-dialog.component.html',
  styleUrls: ['./carpooling-dialog.component.scss'],
})

export class CarpoolingDialogComponent {
  _carpoolingId!: number;
  code!: number[];

constructor(
  @Inject(MAT_DIALOG_DATA) public data: { code: number },
  @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface
  ) {}

  ngOnInit(): void {
    if (this.data.code) {
      const stringifiedCode = this.data.code.toString();
      while (stringifiedCode.length < 6) {
        '0'.concat(stringifiedCode);
      }
      this.code = stringifiedCode.split('').map((char) => parseInt(char));
    }
  }
}
