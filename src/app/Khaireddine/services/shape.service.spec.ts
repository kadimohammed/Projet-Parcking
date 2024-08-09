/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShapeService } from './shape.service';

describe('Service: Shape', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeService]
    });
  });

  it('should ...', inject([ShapeService], (service: ShapeService) => {
    expect(service).toBeTruthy();
  }));
});
