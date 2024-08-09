/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParkingService } from './parking.service';

describe('Service: Parking', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingService]
    });
  });

  it('should ...', inject([ParkingService], (service: ParkingService) => {
    expect(service).toBeTruthy();
  }));
});
