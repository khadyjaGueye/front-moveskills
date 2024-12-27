import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DernierTestComponent } from './dernier-test.component';

describe('DernierTestComponent', () => {
  let component: DernierTestComponent;
  let fixture: ComponentFixture<DernierTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DernierTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DernierTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
