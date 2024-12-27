import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatLoisComponent } from './resultat-lois.component';

describe('ResultatLoisComponent', () => {
  let component: ResultatLoisComponent;
  let fixture: ComponentFixture<ResultatLoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatLoisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatLoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
