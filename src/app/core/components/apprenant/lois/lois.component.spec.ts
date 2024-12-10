import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoisComponent } from './lois.component';

describe('LoisComponent', () => {
  let component: LoisComponent;
  let fixture: ComponentFixture<LoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
