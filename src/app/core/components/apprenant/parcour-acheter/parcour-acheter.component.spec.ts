import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourAcheterComponent } from './parcour-acheter.component';

describe('ParcourAcheterComponent', () => {
  let component: ParcourAcheterComponent;
  let fixture: ComponentFixture<ParcourAcheterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcourAcheterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcourAcheterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
