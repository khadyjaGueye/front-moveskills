import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorDetailsModalComponent } from './color-details-modal.component';

describe('ColorDetailsModalComponent', () => {
  let component: ColorDetailsModalComponent;
  let fixture: ComponentFixture<ColorDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColorDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
