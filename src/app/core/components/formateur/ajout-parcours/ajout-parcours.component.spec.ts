import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutParcoursComponent } from './ajout-parcours.component';

describe('AjoutParcoursComponent', () => {
  let component: AjoutParcoursComponent;
  let fixture: ComponentFixture<AjoutParcoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutParcoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutParcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
