import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CarpoolingService } from './carpooling.service';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';

describe('CarpoolingService', () => {
  let service: CarpoolingService;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
      ]
    });
    service = TestBed.inject(CarpoolingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
