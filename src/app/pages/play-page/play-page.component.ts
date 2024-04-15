import { Component } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Params, Router} from "@angular/router";
import {buildQueryParamsFromPlayers, parsePlayersFromQueryParams, Player} from "../../shared/models/player";
import {DartsConfig} from "../../shared/models/darts";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Game} from "../../shared/utils/game";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {PrimeIcons} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {VirtualKeyboardComponent} from "../../shared/components/virtual-keyboard/virtual-keyboard.component";
import {NgForOf, NgIf} from "@angular/common";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {DeviceDetectorService} from "ngx-device-detector";
import {StyleClassModule} from "primeng/styleclass";
import {FieldsetModule} from "primeng/fieldset";
import {AvatarModule} from "primeng/avatar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {Carousel, CarouselModule} from "primeng/carousel";
import {DividerModule} from "primeng/divider";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {gameUuidGuard} from "../../shared/guards/game-uuid.guard";

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
    InputGroupAddonModule,
    StyleClassModule,
    FieldsetModule,
    AvatarModule,
    NgForOf,
    ScrollPanelModule,
    CarouselModule,
    DividerModule
  ],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent {

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly game: Game;
  protected scoreFormControl = new FormControl();
  protected showVirtualKeyboard = false;
  protected responsiveOptions = [
    {
      breakpoint: '749px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '199px',
      numVisible: 1,
      numScroll: 1
    },
  ];

  constructor(
    deviceService: DeviceDetectorService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.showVirtualKeyboard = deviceService.isMobile() || deviceService.isTablet();
    console.log(deviceService.getDeviceInfo());

    this.game = Game.parseGame(activatedRoute.snapshot.data['game']);
    this.fixQueryParams();
  }

  addScore() {
    if (this.scoreFormControl.value == null) return;

    console.log('score:', this.scoreFormControl.value);
    this.game.addScore(this.scoreFormControl.value);
    this.scoreFormControl.reset();

    this.localStorageService.saveGame(this.game);
  }

  toggleVirtualKeyboard(elem: HTMLElement) {
    this.showVirtualKeyboard = !this.showVirtualKeyboard;
    setTimeout(() => {
      this.getCarouselNumber(elem);
      this.updateCarousel(true);
    });
  }

  getCarouselNumber(elem: HTMLElement) {
    let num = Math.floor(elem.clientWidth / 250);
    num = Math.min(num, this.game.players.length);
    if (this.carouselNumVisible !== num) {
      console.log('carousel-number:', num);
      this.carouselNumVisible = num;
      this.updateCarousel(true);
    }
  }


  protected carouselNumVisible = 1;
  protected carouselState = true;
  private updateCarousel(state: boolean) {
    if (state) {
      this.carouselState = false
      this.updateCarousel(false)
      return;
    }
    this.carouselState = true
  }

  private fixQueryParams() {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: buildQueryParamsFromPlayers(this.game.players),
    })
  }
}
