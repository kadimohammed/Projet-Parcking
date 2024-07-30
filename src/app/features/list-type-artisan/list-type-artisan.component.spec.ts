import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeArtisanComponent } from './list-type-artisan.component';

describe('ListTypeArtisanComponent', () => {
  let component: ListTypeArtisanComponent;
  let fixture: ComponentFixture<ListTypeArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeArtisanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
