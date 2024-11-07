import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTestComponent } from './liste-test.component';

describe('ListeTestComponent', () => {
  let component: ListeTestComponent;
  let fixture: ComponentFixture<ListeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
