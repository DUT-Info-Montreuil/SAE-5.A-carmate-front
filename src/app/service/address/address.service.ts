import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AddressService {

  private nominatimApiPreUrl = 'https://nominatim.openstreetmap.org/search.php?q=';
  private nominatimApiPostUrl = '&countrycodes=fr&limit=5&format=jsonv2&addressdetails=1&layer=address'

  constructor(private http: HttpClient) {}

  search(term: string): Observable<any> {
    term = term.replaceAll(' ', '+');
    return this.http.get<any>(`${this.nominatimApiPreUrl}${term}${this.nominatimApiPostUrl}`);
  }
}

