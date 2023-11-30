import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCarpoolComponent } from './publish-carpool.component';

describe('PublishCarpoolComponent', () => {
  let component: PublishCarpoolComponent;
  let fixture: ComponentFixture<PublishCarpoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishCarpoolComponent]
    });
    fixture = TestBed.createComponent(PublishCarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
