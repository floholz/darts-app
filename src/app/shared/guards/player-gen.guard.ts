import {CanActivateFn, Router} from '@angular/router';
import {v4 as uuidv4, validate} from 'uuid';
import {genPlayerQueryParams, sanitizePlayerQueryParams} from "../models/player";
import {inject} from "@angular/core";

export const playerGenGuard: CanActivateFn = (route, state) => {
  const [sanitizedQueryParams, numQueryPlayers, numberStripped] = sanitizePlayerQueryParams(route.queryParams);
  console.log(sanitizedQueryParams)

  const uuidOrPlayers = route.params['uuid'];
  if (!validate(uuidOrPlayers)) {
    let num = Number(uuidOrPlayers);
    if (!isNaN(num)) {
      num = Math.abs(num);
      const numToAdd = Math.max(num - numQueryPlayers, 0);
      const addedQueryParams: any =  {};
      genPlayerQueryParams(numToAdd).forEach(
        (queryString, index) => addedQueryParams[`p${numQueryPlayers + index + 1}`] = queryString
      );
      return inject(Router).navigate([
        'play',
        route.params['score'],
        route.params['sets'],
        route.params['legs'],
        route.params['checkout'],
        uuidv4(),
      ], {
        queryParams: addedQueryParams,
        queryParamsHandling: "merge",
      });
    }
  }

  if (numQueryPlayers === 0) {
    const addedQueryParams: any =  {};
    genPlayerQueryParams(2).forEach(
      (queryString, index) => addedQueryParams[`p${index + 1}`] = queryString
    );
    return inject(Router).navigate([
      'play',
      route.params['score'],
      route.params['sets'],
      route.params['legs'],
      route.params['checkout'],
      route.params['uuid'],
    ], {
      queryParams: addedQueryParams,
      queryParamsHandling: "merge",
    });
  }

  if (numberStripped > 0) {
    return inject(Router).navigate([
      'play',
      route.params['score'],
      route.params['sets'],
      route.params['legs'],
      route.params['checkout'],
      route.params['uuid'],
    ], {
      queryParams: sanitizedQueryParams,
    });
  }

  return true;
};
