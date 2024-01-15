import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedCarpoolingDialogComponent } from './published-carpooling-dialog.component';

describe('PublishedCarpoolingDialogComponent', () => {
  let component: PublishedCarpoolingDialogComponent;
  let fixture: ComponentFixture<PublishedCarpoolingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedCarpoolingDialogComponent]
    });
    fixture = TestBed.createComponent(PublishedCarpoolingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
