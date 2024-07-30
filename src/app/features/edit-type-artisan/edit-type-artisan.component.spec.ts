import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTypeArtisanComponent } from './edit-type-artisan.component';

describe('UpdateTypeArtisanComponent', () => {
  let component: UpdateTypeArtisanComponent;
  let fixture: ComponentFixture<UpdateTypeArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTypeArtisanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTypeArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
