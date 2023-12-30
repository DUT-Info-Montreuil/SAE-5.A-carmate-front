import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressServiceInterface, School } from 'src/app/interface/other';


@Injectable({
  providedIn: 'root'
})

export class AddressService implements AddressServiceInterface {

  private nominatimApiSearchPreUrl = 'http://localhost:8181/search.php?q=';
  private nominatimApiSearchPostUrl = '&countrycodes=fr&limit=5&format=jsonv2&addressdetails=1&layer=address&viewbox=49.0487,2.7521,48.7598,2.1121';
  private nominatimApiFindPreUrl = 'http://localhost:8181/reverse?';
  private nominatimApiFindPostUrl = '&zoom=18&format=jsonv2&addressdetails=1&accept-language=fr&layer=address';

  $schoolList: School[] = [
    {lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France'},
  ]

  constructor(private http: HttpClient) {}

  search(term: string): Observable<any> {
    term = term.replaceAll(' ', '+');
    return this.http.get<any>(`${this.nominatimApiSearchPreUrl}${term}${this.nominatimApiSearchPostUrl}`);
  }

  find(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`${this.nominatimApiFindPreUrl}lat=${lat}&lon=${lon}${this.nominatimApiFindPostUrl}`);
  }
  
  matchingSchoolDeparture(lat: number, lon: number): string | undefined {
    const school = this.$schoolList.find(school => school.lat === lat && school.lon === lon);
    return school ? school.name : undefined;
  }
}

