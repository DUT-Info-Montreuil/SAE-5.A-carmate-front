import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faClock, faEuro, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { CARPOOLING_SERVICE_TOKEN, Carpooling, CarpoolingServiceInterface } from '../../interface/carpooling';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-publish-carpool',
  templateUrl: './publish-carpool.component.html',
  styleUrls: ['./publish-carpool.component.scss']
})

export class PublishCarpoolComponent {
  protected readonly faLocationdot = faLocationDot;
  protected readonly faUser = faUser;
  protected readonly faEuro = faEuro;
  protected readonly faClock = faClock;
  obsDisplayedAddressesStart: Observable<string[]> = of([]);
  obsDisplayedAddressesDest: Observable<string[]> = of([]);
  private displayedAddresses: string[] = [];
  private objDisplayedAddresses: any[] = [];
  private starting_coords: number[] = [];
  private destination_coords: number[] = [];
  protected publishForm = new FormGroup({
    starting_point: new FormControl("", [Validators.required, this.starting_pointValidator()]),
    destination: new FormControl("", [Validators.required,  this.destinationtValidator()]),
    max_passengers: new FormControl("", [Validators.required, this.max_passengersValidator()]),
    price: new FormControl(0, [Validators.required, this.priceValidator()]),
    departure_date: new FormControl("", [Validators.required]),
    departure_time: new FormControl("", [Validators.required]),
  });
  @ViewChild(MatAutocompleteTrigger) destinationTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) departureTrigger!: MatAutocompleteTrigger;

  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
    private router: Router,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    ) {}

  ngOnInit() {
    this.setupAutocomplete();
  }

  private setupAutocomplete(): void {

  ['starting_point', 'destination'].forEach((element => {
      this.publishForm.get(element)!.valueChanges.pipe(
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

  private max_passengersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value >= 1 && control.value <= 4) {
        return null;
      } else {
        return { 'Invalid max_passengers input': true };
      }
    };
  }

  private priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value >= 0) {
        return null;
      } else {
        return { 'Invalid price input': true };
      }
    };
  }

  submit(): void {
    let dateStart: Date = new Date(this.publishForm.get('departure_date')!.value!);
    let timeString: string = this.publishForm.get('departure_time')!.value!;
    let timeParts = timeString.split(":");

    dateStart.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));

    let departureDateTimeUnix = dateStart.getTime() / 1000;

    let payload = {
      starting_point: this.starting_coords,
      destination: this.destination_coords,
      max_passengers: Number(this.publishForm.get('max_passengers')!.value!),
      price: Number(this.publishForm.get('price')!.value!),
      departure_date_time: departureDateTimeUnix
    };

    this.carpoolingService.publish(payload).subscribe({
      next: () => {
        this.notifier.success("Le trajet a été publié.");
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.notifier.error("Un ou plusieurs champs sont invalides.");
            break;
          case 401:
            this.notifier.error("Vous n'avez pas accès à ce contenu.");
            break;
          case 403:
            this.notifier.error("Le rôle de conducteur n'est pas encore validé.");
            break;
          case 409:
            this.notifier.error("Création impossible: \
            Cet abonnement est en conflit avec une réservation, un covoiturage créer un autre abonnement ou un covoiturage régulier");
            break;
          default:
            this.notifier.error("Erreur interne.");
            break;
        }
    }});
  }
}
