/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { XmlService } from './Xml.service';

describe('Service: Xml', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmlService]
    });
  });

  it('should ...', inject([XmlService], (service: XmlService) => {
    expect(service).toBeTruthy();
  }));
});
