import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeArtisanComponent } from './add-type-artisan.component';

describe('AddTypeArtisanComponent', () => {
  let component: AddTypeArtisanComponent;
  let fixture: ComponentFixture<AddTypeArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTypeArtisanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
