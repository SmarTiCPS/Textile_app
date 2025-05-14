import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartGaugeComponent } from './echart-gauge.component';

describe('EchartGaugeComponent', () => {
  let component: EchartGaugeComponent;
  let fixture: ComponentFixture<EchartGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchartGaugeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchartGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
