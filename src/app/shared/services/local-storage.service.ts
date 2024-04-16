import { Injectable } from '@angular/core';
import {Game} from "../utils/game";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly LS_KEY_GAMES: string = 'games';

  constructor() { }

  // Set a value in local storage
  private setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  private getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  private removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }

  getAllSavedGames(): Game[] {
    const lsGames = this.getItem(this.LS_KEY_GAMES);
    if (lsGames) {
      return JSON.parse(lsGames) as Game[];
    }
    return [];
  }

  saveGame(game: Game): void {
    let savedGames = this.getAllSavedGames();
    const idx = savedGames.findIndex(g => g.uuid === game.uuid);
    if (idx !== -1) {
      savedGames[idx] = game;
    } else if (savedGames.length >= 3) {
      savedGames = savedGames.slice(1);
    } else {
      savedGames.push(game);
    }
    this.setItem(this.LS_KEY_GAMES, JSON.stringify(savedGames, Game.replacer));
  }

  getSavedGame(uuid: string): Game | null {
    if (!uuid) return null;

    const savedGames = this.getAllSavedGames();
    const idx = savedGames.findIndex(g => g.uuid === uuid);
    if (idx !== -1) {
      return savedGames[idx];
    }
    return null;
  }
}
