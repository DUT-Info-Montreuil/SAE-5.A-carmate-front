import {Component, Inject, ViewChild} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, Search } from '../../interface/carpooling';
import { HttpErrorResponse } from '@angular/common/http';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from '../../interface/other';
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent {
  obsDisplayedAddressesStart: Observable<string[]> = of([]);
  obsDisplayedAddressesDest: Observable<string[]> = of([]);
  private displayedAddresses: string[] = [];
  private objDisplayedAddresses: any[] = [];
  private starting_coords: number[] = [];
  private destination_coords: number[] = [];
  searchForm = new FormGroup({
    starting_point: new FormControl("", [Validators.required, this.starting_pointValidator()]),
    destination: new FormControl("", [Validators.required, this.destinationtValidator()]),
    departure_date: new FormControl("", [Validators.required]),
    departure_time: new FormControl("", [])
  });
  @ViewChild(MatAutocompleteTrigger) destinationTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) departureTrigger!: MatAutocompleteTrigger;


  constructor(
    private router: Router,
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    ) {}

  ngOnInit() {
    const addressList: string[] = [
      'starting_point',
      'destination'
    ];

    addressList.forEach((element => {

      this.searchForm.get(element)!.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((value) => this.addressService.search(value!)),
      ).subscribe((addresses) => {
        if (Array.isArray(addresses) && addresses.length > 0) {

          let displayResults: string[] = [];

          for (let index = 0; index < addresses.length; index++) {
            let address = addresses[index].address;
            if (address) {
              let house_number = 'house_number' in address ? address.house_number : '';
              let building = 'building' in address ? address.building : '';
              let town = 'town' in address ? address.town : '';
              let city = 'city' in address ? address.city : '';
              let village = 'village' in address ? address.village : '';

              displayResults.push(
              `${building || house_number} ${addresses[index].address.road}, ${city || village || town}, ${addresses[index].address.postcode}`
              );
            }
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

  submit(): void {
    let dateStart: Date = new Date(this.searchForm.get('departure_date')!.value!)
    const [hours, minutes] = this.searchForm.get('departure_time')!.value!.split(':').map(Number);
    dateStart.setHours(hours ?? 0, minutes ?? 0, 0, 0);

    const [start_lat, start_lon] = this.starting_coords
    const [end_lat, end_lon] = this.destination_coords

    let payload: Search = {
      start_lat: start_lat,
      start_lon: start_lon,
      end_lat: end_lat,
      end_lon: end_lon,
      departure_date_time: `${Math.floor(dateStart.getTime() / 1000)}`
    };

    this.carpoolingService.search(payload).subscribe({
      next: (response) => {
        //TODO Implemente list result
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.notifier.error("Un ou plusieurs champs sont invalides.");
            break;
          case 503:
            this.notifier.error("Service momentanément indisponible.");
            break;
          default:
            this.notifier.error("Erreur interne.");
            break;
        }
    }});
  }
}
