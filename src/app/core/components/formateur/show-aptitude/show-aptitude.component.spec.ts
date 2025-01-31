import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAptitudeComponent } from './show-aptitude.component';

describe('ShowAptitudeComponent', () => {
  let component: ShowAptitudeComponent;
  let fixture: ComponentFixture<ShowAptitudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAptitudeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAptitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
