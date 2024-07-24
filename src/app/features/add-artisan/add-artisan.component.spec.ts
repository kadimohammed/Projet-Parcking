import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtisanComponent } from './add-artisan.component';

describe('AddArtisanComponent', () => {
  let component: AddArtisanComponent;
  let fixture: ComponentFixture<AddArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArtisanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
