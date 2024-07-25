import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingsMapsComponent } from './parkings-maps.component';

describe('ParkingsMapsComponent', () => {
  let component: ParkingsMapsComponent;
  let fixture: ComponentFixture<ParkingsMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingsMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingsMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
