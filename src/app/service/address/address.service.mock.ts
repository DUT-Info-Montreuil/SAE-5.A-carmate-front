import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AddressServiceInterface, School } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root',
})
export class MockAddressService implements AddressServiceInterface {
  constructor() {}

  private addresses: {
    lat: number;
    lon: number;
    address: {
      house_number?: string;
      building?: string;
      town?: string;
      city?: string;
      village?: string;
      road: string;
      postcode: string;
    };
  }[] = [
    {
      lat: 48.9757551,
      lon: 2.559337,
      address: {
        house_number: '1',
        city: 'Marseille',
        road: 'Rue de la République',
        postcode: '13001',
      },
    },
    {
      lat: 48.8569,
      lon: 2.3817,
      address: {
        house_number: '4',
        city: 'Nantes',
        road: 'Avenue des Fleurs',
        postcode: '44000',
      },
    },
    {
      lat: 48.8520,
      lon: 2.3176,
      address: {
        house_number: '7',
        city: 'Lille',
        road: 'Rue du Commerce',
        postcode: '59000',
      },
    },
  ];

  $schoolList: School[] = [
    {lat: 48.9757551, lon: 2.559337, name: 'IUT de Tremblay-en-France'},
  ]

  search(term: string): Observable<any>  {
    return of(this.addresses);
  }

  find(lat: number, lon: number): Observable<any>  {
    return of(this.addresses[0]);
  }

  matchingSchoolDeparture(lat: number, lon: number): string | undefined {
    const school = this.$schoolList.find(school => school.lat === lat && school.lon === lon);
    return school ? school.name : undefined;
  }
}
