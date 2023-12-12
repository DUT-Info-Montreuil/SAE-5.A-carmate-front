import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import { CarpoolService } from '../carpool/carpool.service';
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../interface/other";
import { provideHttpClient, HttpClient,  HttpClientModule} from '@angular/common/http';

describe('AddressService', () => {
  let service: AddressService;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyCarpoolService: jasmine.SpyObj<CarpoolService>;
  let spyAddressService: jasmine.SpyObj<AddressService>
  let spyHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(AddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
