import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionImageParkingComponent } from './gestion-image-parking.component';

describe('GestionImageParkingComponent', () => {
  let component: GestionImageParkingComponent;
  let fixture: ComponentFixture<GestionImageParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionImageParkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionImageParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
