import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { savedGameResolver } from './saved-game.resolver';

describe('savedGameResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => true;
      //  TestBed.runInInjectionContext(() => savedGameResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
