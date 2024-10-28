import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuquerComponent } from './commuquer.component';

describe('CommuquerComponent', () => {
  let component: CommuquerComponent;
  let fixture: ComponentFixture<CommuquerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuquerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommuquerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
