import { Component } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Player} from "../../shared/models/player";
import {DartsConfig} from "../../shared/models/darts";

@Component({
  selector: 'app-play-page',
  standalone: true,
  imports: [],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent {

  config: DartsConfig;
  players: Player[];

  constructor(activatedRoute: ActivatedRoute) {
    this.config = activatedRoute.snapshot.params as DartsConfig;
    this.players = this.parsePlayersFromQueryParams(activatedRoute.snapshot.queryParams);
    console.log(this.config);
    console.log(this.players);
  }


  private parsePlayersFromQueryParams(params: Params): Player[] {
    const players: Player[] = [];

    let idx = 1;
    let tempPlayer = this.buildPlayerFromString(params[`p${idx}`]);
    while(tempPlayer) {
      players.push(tempPlayer);
      idx++;
      tempPlayer = this.buildPlayerFromString(params[`p${idx}`]);
    }

    return players;
  }

  private buildPlayerFromString(str: string): Player | null {
    if (!str || str.length < 8) {
      return null;
    }

    let color = str.slice(0, 7);
    if (color[0] !== '#') {
      return null;
    }
    const name = str.slice(7);
    return {color, name};
  }
}
