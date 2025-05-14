import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityEchartComponent } from './availability-echart.component';

describe('AvailabilityEchartComponent', () => {
  let component: AvailabilityEchartComponent;
  let fixture: ComponentFixture<AvailabilityEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityEchartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailabilityEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
