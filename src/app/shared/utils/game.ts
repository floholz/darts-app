import {DartsConfig, LegScores, SetScores} from "../models/darts";
import {GamePlayer, Player} from "../models/player";
import {FormControl} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';

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

  constructor(config: DartsConfig, players: Player[], uuid?: string) {
    this.uuid = uuid??uuidv4();
    this.config = config;
    this.initPlayers(config, players);
  }

  public addScore(score: number): void {
    let visit = this.players[this.activePlayer].history[this.activeSet][this.activeLeg][this.activeVisit];
    if (!visit) {
      this.players[this.activePlayer].history[this.activeSet][this.activeLeg].push([undefined, undefined, undefined]);
    }
    this.players[this.activePlayer].history[this.activeSet][this.activeLeg][this.activeVisit][this.activeDart] = score;
    this.players[this.activePlayer].score -=  score;
    console.log(this.players[this.activePlayer]);

    if (this.players[this.activePlayer].score <= 0) {
      console.log(this.players[this.activePlayer].name, 'won the leg');
      this.players[this.activePlayer].legsWon++;
      this.resetScores();
      this.startingPlayer++;
      this.activePlayer = this.startingPlayer;
      return;
    }

    // update dart
    this.activeDart = (this.activeDart+1)%3;

    // update player
    if (this.activeDart === 0) {
      this.activePlayer = (this.activePlayer+1)%this.players.length;

      if (this.activePlayer === this.startingPlayer) {
        this.activeVisit++;
      }
    }
  }

  private initPlayers(config: DartsConfig, pls: Player[]) {
    pls.forEach((player, idx) => {
      const history: SetScores[] = [... Array(this.config.sets)].map(() => [... Array(this.config.legs)].map(() => []));
      this.players.push({
        id: 'p-' + idx,
        name: player.name,
        color: player.color,
        score: this.config.score,
        setsWon: 0,
        legsWon: 0,
        history: history,
      });
    });
  }

  private resetScores(){
    this.players.forEach(player => player.score = this.config.score);
  }
}
