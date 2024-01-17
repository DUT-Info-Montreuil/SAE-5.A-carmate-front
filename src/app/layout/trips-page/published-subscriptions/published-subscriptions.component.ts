import { Component, Inject, Input } from '@angular/core';
import { PublishedSubscription, WeekDay } from 'src/app/interface/carpooling';
import {
  faCalendar,
  faCar,
  faArrowRight,
  faLocationDot,
  faRepeat,
  faTag,
  faClock,
  faSpinner,
  faUser,
  faEllipsisV,
  faXmark
  } from '@fortawesome/free-solid-svg-icons';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import * as moment from 'moment';
import { take } from 'rxjs';
import { PROFILE_SERVICE_TOKEN, ProfilesServiceInterface } from 'src/app/interface/profiles';
import { MatDialog } from '@angular/material/dialog';
import { PublishedCarpoolingDialogComponent } from '../published-carpoolings/published-carpooling-dialog/published-carpooling-dialog.component';

registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-published-subscriptions',
  templateUrl: './published-subscriptions.component.html',
  styleUrls: ['./published-subscriptions.component.scss']
})

export class PublishedSubscriptionsComponent {
  protected readonly faCalendar = faCalendar;
  protected readonly faCar = faCar;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faRepeat = faRepeat;
  protected readonly faTag = faTag;
  protected readonly faClock = faClock;
  protected readonly faSpinner = faSpinner;
  protected readonly faUser = faUser;
  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faXmark = faXmark;
  @Input() publishedSubscription!: PublishedSubscription;
  startingPointToDisplay!: string;
  destinationToDisplay!: string;
  pendingCarpoolingsToDisplay!: Date[];
  bookedCarpoolingsToDisplay: {
    id: number,
    starting_point: string,
    destination: string,
    departure_date: Date,
    departure_hour: string,
    max_passengers: number,
    seats_taken: number,
    passengers: string[],
    driver_first_name: string,
    driver_last_name: string,
    isToday: boolean,
    isOutdated: boolean,
  }[]=[];
  dayTranslations: { [key: string]: string } = {
    'Monday': 'Lundi',
    'Tuesday': 'Mardi',
    'Wednesday': 'Mercredi',
    'Thursday': 'Jeudi',
    'Friday': 'Vendredi',
    'Saturday': 'Samedi',
    'Sunday': 'Dimanche'
  };

  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    @Inject(PROFILE_SERVICE_TOKEN) private profileService: ProfilesServiceInterface,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.addressService.getFormattedAddress(this.publishedSubscription.starting_point).pipe(take(1)).subscribe((startingPoint) => {
      this.startingPointToDisplay = startingPoint;
    });
    this.addressService.getFormattedAddress(this.publishedSubscription.destination).pipe(take(1)).subscribe((destination) => {
      this.destinationToDisplay = destination;
    });
    this.generatePendingCarpoolings();
    this.generateBookedCarpoolings();
    this.sortCarpoolings();
  }

  translateDays(days: WeekDay[]): string[] {
    return days.map(day => this.dayTranslations[day] || day);
  }

  private generatePendingCarpoolings(): void {
    let dates: Date[] = [];
    let currentDate = moment();

    while (currentDate.unix() <= this.publishedSubscription.end_date/1000) {
      if (this.publishedSubscription.days.includes(currentDate.format('dddd') as WeekDay)) {
        dates.push(currentDate.toDate());
      }
      currentDate.add(1, 'days');
    }

    let carpoolingDates = this.publishedSubscription.carpools.map(c => moment(c.departure_date_time).startOf('day').unix());
    this.pendingCarpoolingsToDisplay = dates.filter(date => !carpoolingDates.includes(moment(date).startOf('day').unix()));
  }

  private generateBookedCarpoolings(): void {
    this.publishedSubscription.carpools.filter(c => !c.is_canceled).forEach(carpool => {
      let bookedCarpoolingToDisplay: {
        id: number,
        starting_point: string,
        destination: string,
        departure_date: Date,
        departure_hour: string,
        max_passengers: number,
        seats_taken: number,
        passengers: string[],
        driver_first_name: string,
        driver_last_name: string,
        isToday: boolean,
        isOutdated: boolean,
      } = {
        id: carpool.id,
        starting_point: '',
        destination: '',
        departure_date: new Date(carpool.departure_date_time),
        departure_hour: '',
        max_passengers: carpool.max_passengers,
        seats_taken: carpool.seats_taken!,
        passengers: [],
        driver_first_name: '',
        driver_last_name: '',
        isToday: false,
        isOutdated: false,
      };

      this.addressService.getFormattedAddress(carpool.starting_point).pipe(take(1)).subscribe((startingPoint) => {
        bookedCarpoolingToDisplay.starting_point = startingPoint;
      });
      this.addressService.getFormattedAddress(carpool.destination).pipe(take(1)).subscribe((destination) => {
        bookedCarpoolingToDisplay.destination = destination;
      });
      this.profileService.getDriverProfile(carpool.driver_id!).pipe(take(1)).subscribe((profile) => {
        bookedCarpoolingToDisplay.driver_first_name = profile.first_name;
        bookedCarpoolingToDisplay.driver_last_name = profile.last_name;
      });
      bookedCarpoolingToDisplay.passengers = carpool.passengers_profile.map(passenger => {
        return passenger.first_name + ' ' + passenger.last_name;
      })

      bookedCarpoolingToDisplay.departure_hour = bookedCarpoolingToDisplay.departure_date.toLocaleTimeString()
      bookedCarpoolingToDisplay.isToday = moment(bookedCarpoolingToDisplay.departure_date).isSame(moment(), 'day');
      bookedCarpoolingToDisplay.isOutdated = moment(bookedCarpoolingToDisplay.departure_date).isBefore(moment(), 'day');
      this.bookedCarpoolingsToDisplay.push(bookedCarpoolingToDisplay);
    });
  }

  openDialog(carpooling_id: number): void {
    this.dialog.open(PublishedCarpoolingDialogComponent, {
      width: '340px',
      data: {id: carpooling_id}
    });
  }

  sortCarpoolings(): void {
    this.bookedCarpoolingsToDisplay.sort((a, b) => {
      if (!a.hasOwnProperty('departure_date') || !b.hasOwnProperty('departure_date')) {
        throw new Error('dataIncompatible');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dateA = new Date(a.departure_date);
      dateA.setHours(0, 0, 0, 0);

      const dateB = new Date(b.departure_date);
      dateB.setHours(0, 0, 0, 0);

      if (dateA.getTime() === today.getTime() && dateB.getTime() !== today.getTime()) {
        return -1;
      } else if (dateA.getTime() !== today.getTime() && dateB.getTime() === today.getTime()) {
        return 1;
      } else if (dateA.getTime() < today.getTime() && dateB.getTime() >= today.getTime()) {
        return 1;
      } else if (dateA.getTime() >= today.getTime() && dateB.getTime() < today.getTime()) {
        return -1;
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });
  }
}
