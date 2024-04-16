import {DartsConfig, SetScores} from "../models/darts";
import {GamePlayer, Player} from "../models/player";
import {Subject} from "rxjs";

export enum GameEvent {
  GAME_WIN,
  LEG_WIN,
  SET_WIN,
  BUST,
  RESTART,
}

export class Game {
  uuid: string;
  config: DartsConfig;
  players: GamePlayer[] = [];

  activeDart = 0;
  activeVisit = 0;
  activeLeg = 0;
  activeSet = 0;
  activePlayer = 0;
  startingPlayer = 0;

  gameEvents$ = new Subject<GameEvent>()

  constructor(config: DartsConfig, players: Player[], uuid: string) {
    this.uuid = uuid;
    this.config = config;
    this.initPlayers(players);
  }

  public static parseGame(game: Game): Game {
    const newGame = new Game(game.config, [], game.uuid);
    newGame.activeDart = game.activeDart;
    newGame.activeVisit = game.activeVisit;
    newGame.activeLeg = game.activeLeg;
    newGame.activeSet = game.activeSet;
    newGame.activePlayer = game.activePlayer;
    newGame.startingPlayer = game.startingPlayer;
    newGame.players = game.players;
    return newGame;
  }

  public static replacer(key: string, value: any) {
    if (key === 'gameEvents$') return undefined;
    return value;
  }

  public addScore(score: number): void {
    let visit = this.players[this.activePlayer].history[this.activeSet][this.activeLeg][this.activeVisit];
    if (!visit) {
      this.players[this.activePlayer].history[this.activeSet][this.activeLeg].push([undefined, undefined, undefined]);
    }

    visit[this.activeDart] = score;
    this.players[this.activePlayer].score -=  score;

    if (this.players[this.activePlayer].score < 0 || (0 < this.players[this.activePlayer].score && this.players[this.activePlayer].score < this.config.checkout)) {
      console.log('BUST');
      this.gameEvents$.next(GameEvent.BUST);
      for (let i = 0; i < 3; i++) {
        this.players[this.activePlayer].score += visit[i]??0;
      }
      this.players[this.activePlayer].busts[this.activeSet][this.activeLeg].push(this.activeVisit);
      this.activeDart = 2; // so it will change to next player
    } else {
      if (this.players[this.activePlayer].score <= 0) {
        console.log(this.players[this.activePlayer].name, 'won the leg');
        this.gameEvents$.next(GameEvent.LEG_WIN);
        this.players[this.activePlayer].legHistory[this.activeSet]++;
        if (this.players[this.activePlayer].legHistory[this.activeSet] >= this.config.legs) {
          console.log(this.players[this.activePlayer].name, 'won the set');
          this.gameEvents$.next(GameEvent.SET_WIN);
          this.players[this.activePlayer].setHistory[this.activeSet] = true;
          this.players[this.activePlayer].setsWon++;
          if (this.players[this.activePlayer].setsWon >= this.config.sets) {
            console.log(this.players[this.activePlayer].name, 'won the game');
            this.gameEvents$.next(GameEvent.GAME_WIN);
            return;
          }
          this.resetScores();
          this.activeDart = 0;
          this.activeVisit = 0;
          this.activeSet++;
          this.initNextSet();
          this.activeLeg = 0;
          return;
        }
        this.resetScores();
        this.activeDart = 0;
        this.activeVisit = 0;
        this.activeLeg++;
        this.initNextLeg();
        this.startingPlayer = (this.startingPlayer+1)%this.players.length;
        this.activePlayer = this.startingPlayer;
        return;
      }
    }

    // update dart
    this.activeDart = (this.activeDart+1)%3;

    // update player
    if (this.activeDart === 0) {
      this.activePlayer = (this.activePlayer+1)%this.players.length;

      if (this.activePlayer === this.startingPlayer) {
        this.activeVisit++;
        for (const player of this.players) {
          player.history[this.activeSet][this.activeLeg].push([undefined, undefined, undefined]);
        }
      }
    }
  }

  public revertScore(steps: number): void {
    for (let step = 0; step < steps; step++) {
      if (this.activeDart === 0
        && this.activeVisit === 0
        && this.activeLeg === 0
        && this.activeSet === 0
        && this.activePlayer === this.startingPlayer
      ) {
        return;
      }
      // update dart
      const dartOverflow = this.prevDart();
      let playerOverflow = false;
      if (dartOverflow) {
        const leg = this.players[this.activePlayer].history[this.activeSet][this.activeLeg];
        if (leg.length > 1) {
          leg.pop();
        }
        playerOverflow = this.prevPlayer();
      }
      let visitOverflow = false;
      if (playerOverflow) {
        visitOverflow = this.prevVisit();
      }
      if (visitOverflow) return;
      // revert dart
      const score = this.players[this.activePlayer].history[this.activeSet][this.activeLeg][this.activeVisit][this.activeDart];
      this.players[this.activePlayer].score += score??0;
      this.players[this.activePlayer].history[this.activeSet][this.activeLeg][this.activeVisit][this.activeDart] = undefined;
    }
  }

  public restartGame() {
    this.activeDart = 0;
    this.activeVisit = 0;
    this.activeLeg = 0;
    this.activeSet = 0;
    this.activePlayer = 0;
    this.startingPlayer = 0;
    const pls: Player[] = this.players.map(p => {return {name: p.name, color: p.color}});
    this.players = [];
    this.initPlayers(pls);
    this.gameEvents$.next(GameEvent.RESTART);
  }

  private initPlayers(pls: Player[]) {
    pls.forEach((player, idx) => {
      const history: SetScores[] = [[[[undefined, undefined, undefined]]]];
      const busts: number[][][] = [[[]]];
      this.players.push({
        id: 'p-' + idx,
        name: player.name,
        color: player.color,
        score: this.config.score,
        setsWon: 0,
        setHistory: [false],
        legHistory: [0],
        history: history,
        busts: busts,
      });
    });
  }

  private initNextLeg() {
    for (const player of this.players) {
      player.history[this.activeSet].push([[undefined, undefined, undefined]]);
      player.busts[this.activeSet].push([]);
      player.legHistory.push(0);
    }
  }
  private initNextSet() {
    for (const player of this.players) {
      player.history.push([[[undefined, undefined, undefined]]]);
      player.busts.push([[]]);
      player.setHistory.push(false);
    }
  }

  private resetScores(){
    this.players.forEach(player => player.score = this.config.score);
  }

  private checkBust(scoreLeft: number, score: number): boolean {
    return this.config.checkout > scoreLeft - score;
  }

  private nextDart(): boolean {
    this.activeDart = (this.activeDart+1)%3;
    return this.activeDart === 0;
  }

  private prevDart():boolean {
    const temp = this.activeDart - 1;
    if (temp < 0) {
      this.activeDart = 2;
      return true;
    }
    this.activeDart = temp;
    return false;
  }

  private nextPlayer(): boolean {
    this.activePlayer = (this.activePlayer+1)%this.players.length;
    return this.activePlayer === 0;
  }

  private prevPlayer(): boolean {
    const temp = this.activePlayer - 1;
    if (temp < 0) {
      this.activePlayer = this.players.length - 1;
      return true;
    }
    this.activePlayer = temp;
    return false;
  }

  // private nextVisit(): boolean {
  //   this.activeVisit = (this.activeVisit+1)%this.players.length;
  //   return this.activePlayer === 0;
  // }

  private prevVisit(): boolean {
    if (this.activeVisit > 0) {
      this.activeVisit--;
      return false;
    }
    // todo: update sets and legs
    return true;
  }
}
