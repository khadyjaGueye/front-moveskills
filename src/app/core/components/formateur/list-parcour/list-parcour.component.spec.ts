import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParcourComponent } from './list-parcour.component';

describe('ListParcourComponent', () => {
  let component: ListParcourComponent;
  let fixture: ComponentFixture<ListParcourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListParcourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListParcourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
