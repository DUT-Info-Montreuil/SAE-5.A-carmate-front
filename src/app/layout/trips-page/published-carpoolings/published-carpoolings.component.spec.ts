import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedCarpoolingsComponent } from './published-carpoolings.component';

describe('PublishedCarpoolingsComponent', () => {
  let component: PublishedCarpoolingsComponent;
  let fixture: ComponentFixture<PublishedCarpoolingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedCarpoolingsComponent]
    });
    fixture = TestBed.createComponent(PublishedCarpoolingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
