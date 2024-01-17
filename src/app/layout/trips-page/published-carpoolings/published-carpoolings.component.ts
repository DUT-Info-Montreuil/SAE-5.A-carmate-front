import { Component, Inject, Input } from '@angular/core';
import { publishedCarpooling } from 'src/app/interface/carpooling';
import { faCar, faLocationDot, faArrowRight, faCalendar, faClock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import {PassengerProfile, PROFILE_SERVICE_TOKEN, ProfilesServiceInterface} from 'src/app/interface/profiles';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { PublishedCarpoolingDialogComponent } from './published-carpooling-dialog/published-carpooling-dialog.component';
@Component({
  selector: 'app-published-carpoolings',
  templateUrl: './published-carpoolings.component.html',
  styleUrls: ['./published-carpoolings.component.scss']
})
export class PublishedCarpoolingsComponent {
  protected readonly faCar = faCar;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faCalendar = faCalendar;
  protected readonly faClock = faClock;
  protected readonly faUser = faUser;
  protected readonly faXmark = faXmark;
  @Input() publishedCarpooling!: publishedCarpooling;
  carpoolingToDisplay!: {
    departure: string,
    destination: string,
    departureDate: Date,
    departureTime: string,
    max_passengers: number,
    seats_takens: number,
    passengers: string[],
    isToday: boolean,
    isOutdated: boolean,
  };

  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    @Inject(PROFILE_SERVICE_TOKEN) private profileService: ProfilesServiceInterface,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const date = new Date(this.publishedCarpooling.departure_date_time)
    date.setHours(date.getHours() - 1)
    this.carpoolingToDisplay = {
      departure: '',
      destination: '',
      departureDate: new Date(date),
      departureTime: '',
      max_passengers: this.publishedCarpooling.max_passengers,
      seats_takens: this.publishedCarpooling.seats_taken!,
      passengers: [],
      isToday: false,
      isOutdated: false,
    };

    this.addressService.getFormattedAddress(this.publishedCarpooling.starting_point).subscribe(
      (address) => {
        this.carpoolingToDisplay.departure = address;
      }
    );
    this.addressService.getFormattedAddress(this.publishedCarpooling.destination).subscribe(
      (address) => {
        this.carpoolingToDisplay.destination = address;
      }
    );
    this.carpoolingToDisplay.departureTime = moment(date).format('HH:mm');
    this.carpoolingToDisplay.isToday = moment(date).isSame(moment(), 'day');
    this.carpoolingToDisplay.isOutdated = moment(date).isBefore(moment(), 'day');
  }

  openDialog(): void {
    this.dialog.open(PublishedCarpoolingDialogComponent, {
      width: '340px',
      data: {id: this.publishedCarpooling.id}
    });
  }
}
