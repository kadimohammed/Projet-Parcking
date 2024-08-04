import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingDetailsComponent } from './details-parking.component';

describe('ParkingDetailsComponent', () => {
  let component: ParkingDetailsComponent;
  let fixture: ComponentFixture<ParkingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
