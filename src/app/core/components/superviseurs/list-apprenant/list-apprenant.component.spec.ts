import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApprenantComponent } from './list-apprenant.component';

describe('ListApprenantComponent', () => {
  let component: ListApprenantComponent;
  let fixture: ComponentFixture<ListApprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApprenantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
