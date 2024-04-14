import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

export const gameUuidGuard: CanActivateFn = (route, state) => {
  return inject(Router).createUrlTree([
    'play',
    route.params['score'],
    route.params['sets'],
    route.params['legs'],
    route.params['checkout'],
    uuidv4(),
  ], { queryParams: route.queryParams });
};
