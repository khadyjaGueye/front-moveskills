import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasactionComponent } from './trasaction.component';

describe('TrasactionComponent', () => {
  let component: TrasactionComponent;
  let fixture: ComponentFixture<TrasactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrasactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrasactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
