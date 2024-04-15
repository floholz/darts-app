import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { playerGenGuard } from './player-gen.guard';

describe('playerGenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => playerGenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
