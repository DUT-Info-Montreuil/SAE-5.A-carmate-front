import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Carpooling } from 'src/app/interface/carpooling';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';

@Component({
  selector: 'app-carpooling',
  templateUrl: './carpooling.component.html',
  styleUrls: ['./carpooling.component.scss']
})
export class CarpoolingComponent {
  @Input() _carpooling!: Carpooling;
  @Output() _starting_pointDriverEmitter = new EventEmitter<number[]>();
  starting_point!: string;
  destination!: string;
  departure_date!: string;
  departure_time!: string;
  isLoading = true;

  constructor(
    @Inject(ADDRESS_SERVICE_TOKEN) private addressService: AddressServiceInterface,
    ) {}

  ngOnInit() {
    let dateTime = new Date(this._carpooling.departure_date_time);
    this.departure_date = dateTime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    this.departure_time = dateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });    
  
    let matchingSchoolDeparture = this.addressService.matchingSchoolDeparture(
      this._carpooling.starting_point[0], this._carpooling.starting_point[1]
      );

    let matchingSchoolDestination = this.addressService.matchingSchoolDeparture(
      this._carpooling.destination[0], this._carpooling.destination[1]
      );

    if(matchingSchoolDeparture) { 
      this.starting_point = matchingSchoolDeparture;     
    } else {
      this.addressService.find(this._carpooling.starting_point[0], this._carpooling.starting_point[1]).subscribe((addressObject) => {
        let address = addressObject.address;
        let house_number = 'house_number' in address ? address.house_number : '';
        let building = 'building' in address ? address.building : '';
        let town = 'town' in address ? address.town : '';
        let city = 'city' in address ? address.city : '';
        let village = 'village' in address ? address.village : '';

        this.starting_point = `${building || house_number} ${address.road}, ${city || village || town}`  
        this.isLoading = false;
      });
    }

    if(matchingSchoolDestination) { 
      this.destination = matchingSchoolDestination;     
    } else {
      this.addressService.find(this._carpooling.destination[0], this._carpooling.destination[1]).subscribe((addressObject) => {
        let address = addressObject.address;
        let house_number = 'house_number' in address ? address.house_number : '';
        let building = 'building' in address ? address.building : '';
        let town = 'town' in address ? address.town : '';
        let city = 'city' in address ? address.city : '';
        let village = 'village' in address ? address.village : '';

        this.destination = `${building || house_number} ${address.road}, ${city || village || town}`
        this.isLoading = false;
      });
    }
  }

  updateMap(): void {
    this._starting_pointDriverEmitter.emit(this._carpooling.starting_point);
  }
}