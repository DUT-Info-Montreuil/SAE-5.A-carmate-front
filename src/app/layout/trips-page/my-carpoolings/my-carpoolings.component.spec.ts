import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCarpoolingsComponent } from './my-carpoolings.component';
import { ADDRESS_SERVICE_TOKEN, AddressServiceInterface } from 'src/app/interface/other';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';

describe('MyCarpoolingsComponent', () => {
  let component: MyCarpoolingsComponent;
  let fixture: ComponentFixture<MyCarpoolingsComponent>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  let spyAddressService: jasmine.SpyObj<AddressServiceInterface>;
  const carpooling_id: number = 1;

  beforeEach(() => {
    spyDialog = jasmine.createSpyObj('MatDialog', ['open', 'close']);

    spyAddressService = jasmine.createSpyObj('AddressServiceInterface', ['getFormattedAddress']);
    spyAddressService.getFormattedAddress.and.returnValue(of(''));
    TestBed.configureTestingModule({
      declarations: [MyCarpoolingsComponent],
      imports: [
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule
      ],
      providers: [
        {provide: MatDialog, useValue: spyDialog},
        {provide: MAT_DIALOG_DATA, useValue: carpooling_id},
        {provide: ADDRESS_SERVICE_TOKEN, useValue: spyAddressService}
      ]
    });
    fixture = TestBed.createComponent(MyCarpoolingsComponent);
    component = fixture.componentInstance;
    component.carpooling = {
      id: 0,
      starting_point: [0,0],
      destination: [0,0],
      max_passengers: 1,
      seats_taken: 1,
      departure_date_time: '2024-12-31',
      price: 0
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});