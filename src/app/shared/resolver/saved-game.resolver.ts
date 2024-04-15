import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/local-storage.service";
import {DartsConfig} from "../models/darts";
import {parsePlayersFromQueryParams} from "../models/player";
import {Game} from "../utils/game";

export const savedGameResolver: ResolveFn<Game> = (route, state) => {
  const restoredGame = inject(LocalStorageService).getSavedGame(route.params['uuid'])
  if (restoredGame) {
    return restoredGame;
  } else {
    const config = route.params as DartsConfig;
    const players = parsePlayersFromQueryParams(route.queryParams);
    const uuid = route.params['uuid'];
    const game = new Game(config, players, uuid);
    inject(LocalStorageService).saveGame(game);
    return game;
  }
};
