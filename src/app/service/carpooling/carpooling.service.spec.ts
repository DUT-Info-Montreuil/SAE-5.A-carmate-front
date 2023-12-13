import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CarpoolingService } from './carpooling.service';

describe('CarpoolingService', () => {
  let service: CarpoolingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(CarpoolingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
