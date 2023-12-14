import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AddressServiceInterface } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root',
})
export class MockAddressService implements AddressServiceInterface {
  constructor() {}

  private addresses: {
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
      address: {
        house_number: '1',
        building: 'A',
        city: 'Marseille',
        road: 'Rue de la République',
        postcode: '13001',
      },
    },
    {
      address: {
        house_number: '4',
        building: 'B',
        city: 'Nantes',
        road: 'Avenue des Fleurs',
        postcode: '44000',
      },
    },
    {
      address: {
        house_number: '7',
        town: 'Ville-du-Nord',
        city: 'Lille',
        village: '',
        road: 'Rue du Commerce',
        postcode: '59000',
      },
    },
  ];

  search(term: string) {
    return of(this.addresses);
  }
}
