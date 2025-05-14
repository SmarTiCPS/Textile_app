import { TestBed } from '@angular/core/testing';

import { HistaoricDataService } from './histaoric-data.service';

describe('HistaoricDataService', () => {
  let service: HistaoricDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistaoricDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
