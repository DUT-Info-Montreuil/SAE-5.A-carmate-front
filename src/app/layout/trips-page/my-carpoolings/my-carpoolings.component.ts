import { Component, Inject, Input } from '@angular/core';
import { Carpooling } from 'src/app/interface/carpooling';
import { faCar, faLocationDot, faArrowRight, faCalendar, faClock, faUser, faXmark, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { CarpoolingDialogComponent } from './carpooling-dialog/carpooling-dialog.component';
import { RatingDialogComponent } from 'src/app/rating-dialog/rating-dialog.component';

@Component({
  selector: 'app-my-carpoolings',
  templateUrl: './my-carpoolings.component.html',
  styleUrls: ['./my-carpoolings.component.scss']
})
export class MyCarpoolingsComponent {
  protected readonly faCar = faCar;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faCalendar = faCalendar;
  protected readonly faClock = faClock;
  protected readonly faUser = faUser;
  protected readonly faXmark = faXmark;
  protected readonly faStarHalfStroke = faStarHalfStroke;
  @Input() carpooling!: Carpooling;
  carpoolingToDisplay!: {
    departure: string,
    destination: string,
    departureDate: Date,
    departureTime: string,
    max_passengers: number,
    seats_takens: number,
    isToday: boolean,
    isOutdated: boolean,
  };
  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {    
    this.carpoolingToDisplay = {
      departure: '',
      destination: '',
      departureDate: new Date(this.carpooling.departure_date_time),
      departureTime: '',
      max_passengers: this.carpooling.max_passengers,
      seats_takens: this.carpooling.seats_taken!,
      isToday: false,
      isOutdated: false,
    };
    this.addressService.getFormattedAddress(this.carpooling.starting_point).subscribe(
      (address) => {
        this.carpoolingToDisplay.departure = address;
      }
    );
    this.addressService.getFormattedAddress(this.carpooling.destination).subscribe(
      (address) => {
        this.carpoolingToDisplay.destination = address;
      }
    );
    this.carpoolingToDisplay.departureTime = moment(this.carpooling.departure_date_time).format('HH:mm');
    this.carpoolingToDisplay.isToday = moment(this.carpooling.departure_date_time).isSame(moment(), 'day');
    this.carpoolingToDisplay.isOutdated = moment(this.carpooling.departure_date_time).isBefore(moment(), 'day');
  }

  openCaropolingDialog(): void {
    this.dialog.open(CarpoolingDialogComponent, {
      width: '340px',
      data: {id: this.carpooling.id}
    });
  }

  openRatingDialog(): void {
    this.dialog.open(RatingDialogComponent, {
      width: '500px',
      data: {id: this.carpooling.id}
    });
  }
}
