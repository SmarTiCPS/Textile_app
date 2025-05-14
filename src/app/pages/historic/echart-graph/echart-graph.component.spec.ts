import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartGraphComponent } from './echart-graph.component';

describe('EchartGraphComponent', () => {
  let component: EchartGraphComponent;
  let fixture: ComponentFixture<EchartGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchartGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchartGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
