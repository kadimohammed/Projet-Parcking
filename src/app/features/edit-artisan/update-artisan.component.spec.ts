import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArtisanComponent } from './update-artisan.component';

describe('UpdateArtisanComponent', () => {
  let component: UpdateArtisanComponent;
  let fixture: ComponentFixture<UpdateArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateArtisanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
