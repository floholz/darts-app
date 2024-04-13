import { Component } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Player} from "../../shared/models/player";
import {DartsConfig} from "../../shared/models/darts";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Game} from "../../shared/utils/game";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {PrimeIcons} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {VirtualKeyboardComponent} from "../../shared/components/virtual-keyboard/virtual-keyboard.component";
import {NgIf} from "@angular/common";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-play-page',
  standalone: true,
  imports: [
    InputGroupModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ReactiveFormsModule,
    VirtualKeyboardComponent,
    NgIf,
    InputGroupAddonModule
  ],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent {

  protected readonly PrimeIcons = PrimeIcons;

  scoreFormControl = new FormControl();
  showVirtualKeyboard = false;

  private readonly config: DartsConfig;
  private readonly players: Player[];
  private readonly game: Game;

  constructor(activatedRoute: ActivatedRoute, deviceService: DeviceDetectorService) {
    this.showVirtualKeyboard = deviceService.isMobile() || deviceService.isTablet();
    console.log(deviceService.getDeviceInfo());

    this.config = activatedRoute.snapshot.params as DartsConfig;
    this.players = this.parsePlayersFromQueryParams(activatedRoute.snapshot.queryParams);
    console.log(this.config);
    console.log(this.players);
    this.game = new Game(this.config, this.players);
  }

  addScore() {
    if (this.scoreFormControl.value == null) return;

    console.log('score:', this.scoreFormControl.value);
    this.game.addScore(this.scoreFormControl.value);
    this.scoreFormControl.reset();
  }

  toggleVirtualKeyboard() {
    this.showVirtualKeyboard = !this.showVirtualKeyboard;
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
