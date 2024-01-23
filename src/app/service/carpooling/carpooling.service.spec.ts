import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CarpoolingService } from './carpooling.service';
import { NotifierServiceInterface } from 'src/app/interface/notifier.interface';
import { CarpoolingServiceInterface } from 'src/app/interface/carpooling.interface';

describe('CarpoolingService', () => {
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyHttpClient: jasmine.SpyObj<HttpClient>;
  let spyCarpoolingService: CarpoolingServiceInterface;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
      'success',
      'warning',
    ]);
    spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    spyCarpoolingService = new CarpoolingService(
      spyHttpClient,
      spyNotifierService,
    );
  });

  it('should be created', () => {
    expect(spyCarpoolingService).toBeTruthy();
  });
});
