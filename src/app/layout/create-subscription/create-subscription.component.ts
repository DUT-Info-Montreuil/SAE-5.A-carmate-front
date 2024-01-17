import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, CreateSubscriptionPayload, WeekDay } from 'src/app/interface/carpooling';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { faClock, faEuro, faLocationDot, faUser, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface} from "../../interface/user";

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})

export class CreateSubscriptionComponent {
  protected readonly faLocationdot = faLocationDot;
  protected readonly faUser = faUser;
  protected readonly faEuro = faEuro;
  protected readonly faClock = faClock;
  protected readonly faCalendarDay = faCalendarDay;
  protected readonly days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  protected readonly daysMapping: { [key: string]: WeekDay } = {
    'Lundi': 'Monday',
    'Mardi': 'Tuesday',
    'Mercredi': 'Wednesday',
    'Jeudi': 'Thursday',
    'Vendredi': 'Friday'
  };
  obsDisplayedAddressesStart: Observable<string[]> = of([]);
  obsDisplayedAddressesDest: Observable<string[]> = of([]);
  private displayedAddresses: string[] = [];
  private objDisplayedAddresses: any[] = [];
  private starting_coords: number[] = [];
  private destination_coords: number[] = [];
  subForm = new FormGroup({
    starting_point: new FormControl("", [Validators.required, this.starting_pointValidator()]),
    destination: new FormControl("", [Validators.required, this.destinationtValidator()]),
    date_start: new FormControl("", [Validators.required, this.dateValidator()]),
    date_end: new FormControl("", [Validators.required, this.dateValidator()]),
    start_hour: new FormControl("", [Validators.required]),
    days: new FormControl("", [Validators.required]),
    label: new FormControl("", [Validators.required]),
    is_carpooling: new FormControl(false),
    max_passengers: new FormControl(1,[Validators.required, Validators.min(1), Validators.max(4)])
  });
  @ViewChild(MatAutocompleteTrigger) destinationTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) departureTrigger!: MatAutocompleteTrigger;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authenticationService: AuthenticationServiceInterface,
    ) {}

  ngOnInit() {
    ['starting_point','destination'].forEach((element => {
      this.subForm.get(element)!.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((value) => this.addressService.getAddressByString(value!)),
      ).subscribe((addresses) => {
        if (Array.isArray(addresses) && addresses.length > 0) {
          let displayResults: string[] = [];

          for (let index = 0; index < addresses.length; index++) {
            displayResults.push(this.addressService.formatAddress(addresses[index]));
          }

          this.displayedAddresses = displayResults;
          this.objDisplayedAddresses = addresses;

          switch (element) {
            case 'starting_point':
              this.obsDisplayedAddressesStart = of(displayResults);
              break;

            case 'destination':
              this.obsDisplayedAddressesDest = of(displayResults);
              break;
          }
        }
      });
    }));
  }

  starting_pointOptionSelectedHandler(event: any) {
    let lat = this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lat;
    let lon =  this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lon;
    this.starting_coords = [lat, lon];
  }

  destinationOptionSelectedHandler(event: any) {
    let lat = this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lat;
    let lon =  this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lon;
    this.destination_coords = [lat, lon];
  }

  dateFilter: (date: Date | null) => boolean =
  (date: Date | null) => {
    if (date != null){
      const day = date.getDay();
      if(date > new Date()){
        return day !== 0 && day !== 6;
      }
    }
    return false;
  }

  private starting_pointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.displayedAddresses.includes(control.value)) {
        return null;
      } else {
        return {'Invalid address input': true };
      }
    };
  }

  private destinationtValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.displayedAddresses.includes(control.value)) {
        return null;
      } else {
        return { 'Invalid address input': true };
      }
    };
  }

  private dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }

        const inputDate = new Date(value);
        const today = new Date();

        if (inputDate.setHours(0,0,0,0) <= today.setHours(0,0,0,0)) {
            return { 'invalidDate': true };
        }

        const day = inputDate.getDay();
        if (day === 0 || day === 6) {
            return { 'weekend': true };
        }

        return null;
    }
}

  submit() {
    let date_start: Date = new Date(this.subForm.get('date_start')!.value!);
    let date_end: Date = new Date(this.subForm.get('date_end')!.value!);
    date_start.setHours(0, 0, 0, 0);
    date_end.setHours(0, 0, 0, 0);


    let payload: CreateSubscriptionPayload  = {
      starting_point: this.starting_coords,
      destination: this.destination_coords,
      start_date: date_start.getTime() / 1000,
      end_date: date_end.getTime() / 1000,
      start_hour: this.subForm.get('start_hour')!.value!,
      days: this.subForm.get('days')!.getRawValue().map((day: WeekDay) => this.daysMapping[day]),
      label: this.subForm.get('label')!.value!
    }
    if (this.subForm.get('is_carpooling')!.value!) {
      payload.max_passengers = this.subForm.get('max_passengers')!.value!;
    }

    this.carpoolingService.createSubscription(payload).subscribe({
      next: () => {
        this.notifier.success("L'abonnement a été crée avec succès");
        this._snackBar.open("Souhaitez-vous regarder le résultat de votre abonnement ?", "Voir", {
          duration: 5000,
        }).onAction().subscribe(() => {
          this.router.navigate(['/carpooling/my-subscriptions']);
        });
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.notifier.error("Un ou plusieurs champs sont invalides.");
            break;
          case 401:
            this.notifier.error("Jeton expiré, veuillez vous reconnecter");
            break;
          case 403:
            this.notifier.error("Vous n'avez pas accès à ce contenu");
            break;
          case 409:
            this.notifier.error("Création impossible: \
            Cet abonnement est en conflit avec une réservation, un covoiturage créer un autre abonnement ou un covoiturage régulier");
            break;
          case 500:
            this.notifier.error("Erreur inconnue")
            break;
          case 503:
            this.notifier.error("Service momentanément indisponible.");
            break;
          default:
            this.notifier.error("Erreur interne.");
            break;
        }
      }
    })
  }

  get is_driver() {
    return this.authenticationService.isDriver();
  }
}
