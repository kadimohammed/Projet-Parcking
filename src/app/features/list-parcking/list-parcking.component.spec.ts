import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParckingComponent } from './list-parcking.component';

describe('ListParckingComponent', () => {
  let component: ListParckingComponent;
  let fixture: ComponentFixture<ListParckingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListParckingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
