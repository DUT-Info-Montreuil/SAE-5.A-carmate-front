import { Component, Inject, Input } from '@angular/core';
import { Subscription, WeekDay } from 'src/app/interface/carpooling';
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
  faStarHalfStroke,
  faXmark
  } from '@fortawesome/free-solid-svg-icons';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import * as moment from 'moment';
import { take } from 'rxjs';
import { PROFILE_SERVICE_TOKEN, ProfilesServiceInterface } from 'src/app/interface/profiles';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';

registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})

export class SubscriptionComponent {
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
  protected readonly faStarHalfStroke = faStarHalfStroke;
  protected readonly faXmark = faXmark;
  @Input() subscription!: Subscription;
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
    this.addressService.getFormattedAddress(this.subscription.starting_point).pipe(take(1)).subscribe((startingPoint) => {
      this.startingPointToDisplay = startingPoint;
    });
    this.addressService.getFormattedAddress(this.subscription.destination).pipe(take(1)).subscribe((destination) => {
      this.destinationToDisplay = destination;
    });
    this.generatePendingCarpoolings();
    this.generateBookedCarpoolings();
  }

  translateDays(days: WeekDay[]): string[] {
    return days.map(day => this.dayTranslations[day] || day);
  }

  private generatePendingCarpoolings(): void {
    let dates: Date[] = [];
    let currentDate = moment();

    while (currentDate.unix() <= this.subscription.end_date) {
      if (this.subscription.days.includes(currentDate.format('dddd') as WeekDay)) {
        dates.push(currentDate.toDate());
      }
      currentDate.add(1, 'days');
    }    

    let carpoolingDates = this.subscription.carpools.map(c => moment(c.departure_date_time).startOf('day').unix());
    this.pendingCarpoolingsToDisplay = dates.filter(date => !carpoolingDates.includes(moment(date).startOf('day').unix()));
  }

  private generateBookedCarpoolings(): void {
    this.subscription.carpools.filter(c => !c.is_canceled).forEach(carpool => {
      let bookedCarpoolingToDisplay: {
        id: number,
        starting_point: string,
        destination: string,
        departure_date: Date,
        departure_hour: string,
        max_passengers: number,
        seats_taken: number,
        driver_first_name: string,
        driver_last_name: string,
        isToday: boolean,
        isOutdated: boolean,
      } = {
        id: carpool.id!,
        starting_point: '',
        destination: '',
        departure_date: new Date(carpool.departure_date_time),
        departure_hour: '',
        max_passengers: carpool.max_passengers,
        seats_taken: carpool.seats_taken!,
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
      bookedCarpoolingToDisplay.departure_hour = bookedCarpoolingToDisplay.departure_date.toLocaleTimeString()
      bookedCarpoolingToDisplay.isToday = moment(bookedCarpoolingToDisplay.departure_date).isSame(moment(), 'day');
      bookedCarpoolingToDisplay.isOutdated = moment(bookedCarpoolingToDisplay.departure_date).isBefore(moment(), 'day');
      console.log(bookedCarpoolingToDisplay);
      
      this.bookedCarpoolingsToDisplay.push(bookedCarpoolingToDisplay);
    }); 
  }

  openDialog(carpooling_id: number): void {
    this.dialog.open(SubscriptionDialogComponent, {
      width: '360px',
      data: {id: carpooling_id}
    });    
  }
}