import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Carpooling, Search } from 'src/app/interface/carpooling';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { CarpoolingDialogComponent } from '../carpooling-dialog/carpooling-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-carpooling',
  templateUrl: './carpooling.component.html',
  styleUrls: ['./carpooling.component.scss']
})
export class CarpoolingComponent {
  @Input() _carpooling!: Carpooling;
  @Input() _searchParams!: Search;
  @Output() _starting_pointDriverEmitter = new EventEmitter<number[]>();
  starting_point!: string;
  destination!: string;
  departure_date!: string;
  departure_time!: string;
  isLoading = true;

  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    public dialog: MatDialog
    ) {}

  ngOnInit() {
    let dateTime = new Date(this._carpooling.departure_date_time);
    this.departure_date = dateTime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    this.departure_time = dateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    forkJoin({
      starting_point: this.addressService.getFormattedAddress(this._carpooling.starting_point),
      destination: this.addressService.getFormattedAddress(this._carpooling.destination)
    }).subscribe(({ starting_point, destination }) => {
      this.starting_point = starting_point;
      this.destination = destination;
      this.isLoading = false;
    });
  }

  updateMap(): void {    
    this._starting_pointDriverEmitter.emit(this._carpooling.starting_point);
  }

  openDialog(): void {
    this.dialog.open(CarpoolingDialogComponent, {
      width: '1000px',
      data: {
        carpooling: this._carpooling,
        _searchParams: this._searchParams
      }
    });
  }
}