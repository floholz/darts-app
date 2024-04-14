import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gameUuidGuard } from './game-uuid.guard';

describe('gameUuidGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gameUuidGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
