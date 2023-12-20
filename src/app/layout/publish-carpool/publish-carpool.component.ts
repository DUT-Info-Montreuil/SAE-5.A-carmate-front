import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faClock, faEuro, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface, NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { CARPOOLING_SERVICE_TOKEN, Carpooling, CarpoolingServiceInterface } from '../../interface/carpooling';
import { HttpErrorResponse } from '@angular/common/http';

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
    price: new FormControl("", [Validators.required, this.priceValidator(), Validators.min(1)]),// Setup minimal price calclated by the lenght trajet
    departure_date: new FormControl("", [Validators.required]), //Setup minimaldate after today
    departure_time: new FormControl("", [Validators.required]),  //Setup valid format time XX:XX
  });
  
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

    const addressList: string[] = [
      'starting_point',
      'destination' 
    ];

    addressList.forEach((element => {

      this.publishForm.get(element)!.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((value) => this.addressService.search(value!)),
      ).subscribe((addresses) => {
        if (Array.isArray(addresses) && addresses.length > 0) {
          
          let displayResults: string[] = [];
  
          for (let index = 0; index < addresses.length; index++) {
            let house_number = addresses[index].address.house_number || '';
            let building = addresses[index].address.building || '';
            let town = addresses[index].address.town || '';
            let city = addresses[index].address.city || '';
            let village = addresses[index].address.village || '';
          
            displayResults.push(
            `${building || house_number} ${addresses[index].address.road}, ${city || village || town}, ${addresses[index].address.postcode}`
            );
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
      if (control.value > 0) {
        return null;  
      } else {
        return { 'Invalid price input': true };  
      }
    };
  }

  submit(): void {
    let dateStart: Date = new Date(this.publishForm.get('departure_date')!.value!)
    let formatedDate: string =`${dateStart.getFullYear()}-${(dateStart.getMonth() + 1).toString().padStart(2, '0')}-${dateStart.getDate().toString().padStart(2, '0')}`;

    
    let payload: Carpooling = {
      starting_point: this.starting_coords,
      destination: this.destination_coords,
      max_passengers: Number(this.publishForm.get('max_passengers')!.value!),
      price: Number(this.publishForm.get('price')!.value!),
      departure_date_time: `${formatedDate} ${this.publishForm.get('departure_time')!.value!}`
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
          default:
            this.notifier.error("Erreur interne.");
            break;
        }
    }});   
  }
}
