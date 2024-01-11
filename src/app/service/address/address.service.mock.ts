import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/app/environement/environement';
import { AddressServiceInterface, School } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root',
})
export class MockAddressService implements AddressServiceInterface {
  private getAddressByStringPreUrl = `${environment.nominatimAPI}/search.php?q=`;
  private getAddressByStringPostUrl = '&countrycodes=fr&limit=5&format=jsonv2&addressdetails=1&layer=address&viewbox=49.0487,2.7521,48.7598,2.1121';
  private getAddressByCoordsPreUrl = `${environment.nominatimAPI}/reverse?`;
  private getAddressByCoordsPostUrl = '&zoom=18&format=jsonv2&addressdetails=1&accept-language=fr&layer=address';

  $schoolList: School[] = [
    {lat: 48.9757983, lon: 2.5594024, name: 'IUT de Tremblay-en-France'},
  ]

  constructor(private http: HttpClient) {}

  getAddressByString(term: string): Observable<any> {
    term = term.replaceAll(' ', '+');
    return this.http.get<any>(`${this.getAddressByStringPreUrl}${term}${this.getAddressByStringPostUrl}`);
  }

  getAddressByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`${this.getAddressByCoordsPreUrl}lat=${lat}&lon=${lon}${this.getAddressByCoordsPostUrl}`);
  }
  
  matchingSchoolDeparture(lat: number, lon: number): string | undefined {
    const school = this.$schoolList.find(school => school.lat === lat && school.lon === lon);
    return school ? school.name : undefined;
  }

  getFormattedAddress(param: string | number[]): Observable<string> {    
    if (typeof param === 'string') {
      return this.getAddressByString(param).pipe(map((addressObject) => {
        let schoolExist = this.matchingSchoolDeparture(addressObject.lat, addressObject.lon);
        if (schoolExist) {
          return schoolExist;
        } else {
          return this.formatAddress(addressObject);
        }
      }));
    } else if (Array.isArray(param) && param.every(item => typeof item === 'number')) {
      let schoolExist = this.matchingSchoolDeparture(param[0], param[1]);
      if (schoolExist) {
        return of(schoolExist);
      } else {
        return this.getAddressByCoords(param[0], param[1]).pipe(map((addressObject) => {
          return this.formatAddress(addressObject);
        }));
      };
    }
    return of('error');
  }
  
  formatAddress(addressObject: any): string {
    const { address: { house_number = '', building = '', town = '', city = '', village = '', road = '' } = {} } = addressObject;
    return `${building || house_number} ${road}, ${city || village || town}`;
  }
}