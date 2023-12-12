import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faLocationDot, faUser, faEuro, faClock } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AddressService } from '../../service/address/address.service';
import { CarpoolService } from '../../service/carpool/carpool.service';
import { Carpool } from '../../interface/carpool';


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
  private starting_coords: string = '';
  private destination_coords: string = '';
  protected publishForm = new FormGroup({
    starting_point: new FormControl("", [Validators.required, this.starting_pointValidator()]),
    destination: new FormControl("", [Validators.required,  this.destinationtValidator()]),
    max_passengers: new FormControl("", [Validators.required, this.max_passengersValidator()]),
    price: new FormControl("", [Validators.required, this.priceValidator(), Validators.min(1)]),// Setup minimal price calclated by the lenght trajet
    departure_date: new FormControl("", [Validators.required]), //Setup minimaldate after today
    departure_time: new FormControl("", [Validators.required]),  //Setup valid format time XX:XX
  });
  
  constructor(
    private addressService: AddressService,
    private carpoolService: CarpoolService,
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

      let obsDisplayedAddresses = null;

      this.publishForm.get(element)!.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((value) => this.addressService.search(value!)),
      ).subscribe((addresses) => {
        if (Array.isArray(addresses) && addresses.length > 0) {
          console.log(addresses);
          
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
                  
          console.log(displayResults);
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
    this.starting_coords = `${lat};${lon}`;
    console.log(this.starting_coords);
    
  }

  destinationOptionSelectedHandler(event: any) {
    let lat = this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lat;
    let lon =  this.objDisplayedAddresses[this.displayedAddresses.indexOf(event.option.value)].lon;
    this.destination_coords = `${lat};${lon}`;
    console.log(this.destination_coords);
    
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

    
    let payload: Carpool = {
      starting_point: `${this.starting_coords}`,
      destination: `${this.destination_coords}`,
      max_passengers: this.publishForm.get('max_passengers')!.value!,
      price: this.publishForm.get('price')!.value!,
      departure_date_time: `${formatedDate} ${this.publishForm.get('departure_time')!.value!}`
    };
  
    this.carpoolService.publish(payload);
    console.log(payload);
    
  }
}
