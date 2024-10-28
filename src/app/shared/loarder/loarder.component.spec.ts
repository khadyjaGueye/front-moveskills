import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoarderComponent } from './loarder.component';

describe('LoarderComponent', () => {
  let component: LoarderComponent;
  let fixture: ComponentFixture<LoarderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoarderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoarderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
