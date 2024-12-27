import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutApprenantComponent } from './ajout-apprenant.component';

describe('AjoutApprenantComponent', () => {
  let component: AjoutApprenantComponent;
  let fixture: ComponentFixture<AjoutApprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutApprenantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
