import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbGraphComponent } from './db-graph.component';

describe('DbGraphComponent', () => {
  let component: DbGraphComponent;
  let fixture: ComponentFixture<DbGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
