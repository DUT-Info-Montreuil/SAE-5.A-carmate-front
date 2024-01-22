import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import { CarpoolingService } from '../carpooling/carpooling.service';
import {NotifierServiceInterface} from "../../interface/other.interface";
import { HttpClient,  HttpClientModule} from '@angular/common/http';

describe('AddressService', () => {
  let service: AddressService;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingService>;
  let spyAddressService: jasmine.SpyObj<AddressService>;
  let spyHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
