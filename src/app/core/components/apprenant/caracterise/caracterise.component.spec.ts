import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteriseComponent } from './caracterise.component';

describe('CaracteriseComponent', () => {
  let component: CaracteriseComponent;
  let fixture: ComponentFixture<CaracteriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaracteriseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaracteriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
