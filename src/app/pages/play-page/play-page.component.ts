import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {buildQueryParamsFromPlayers} from "../../shared/models/player";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Game, GameEvent} from "../../shared/utils/game";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {Button, ButtonModule} from "primeng/button";
import {ConfirmationService, MessageService, PrimeIcons} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {VirtualKeyboardComponent} from "../../shared/components/virtual-keyboard/virtual-keyboard.component";
import {NgForOf, NgIf} from "@angular/common";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {DeviceDetectorService} from "ngx-device-detector";
import {StyleClassModule} from "primeng/styleclass";
import {FieldsetModule} from "primeng/fieldset";
import {AvatarModule} from "primeng/avatar";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {CarouselModule} from "primeng/carousel";
import {DividerModule} from "primeng/divider";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {Subject, takeUntil} from "rxjs";
import {VirtualKeyComponent} from "../../shared/components/virtual-key/virtual-key.component";
import {KBCode} from "../../shared/models/kb-code";
import {ToastModule} from "primeng/toast";
import {ConfirmPopupModule} from "primeng/confirmpopup";

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
    DividerModule,
    VirtualKeyComponent,
    ToastModule,
    ConfirmPopupModule
  ],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('scoreArea', { static: false }) scoreArea!: ElementRef<HTMLDivElement>;

  protected readonly KBCode = KBCode;
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

  private revertEnabled = true;
  private end$: Subject<void> = new Subject<void>()

  constructor(
    deviceService: DeviceDetectorService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {
    this.showVirtualKeyboard = deviceService.isMobile() || deviceService.isTablet();
    console.log(deviceService.getDeviceInfo());

    this.game = Game.parseGame(activatedRoute.snapshot.data['game']);
    this.game.gameEvents$.pipe(takeUntil(this.end$)).subscribe(event => this.handleGameEvents(event));
    this.fixQueryParams();
  }

  ngOnInit() {
    this.scoreFormControl.valueChanges.pipe(takeUntil(this.end$)).subscribe(value => {
      if (value != null) {
        this.revertEnabled = false;
      }
    });
  }

  ngOnDestroy() {
    this.end$.next();
    this.end$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getCarouselNumber(this.scoreArea.nativeElement);
      this.updateCarousel(true);
    });
  }

  addScore() {
    if (this.scoreFormControl.value == null) return;

    console.log('score:', this.scoreFormControl.value);
    this.game.addScore(this.scoreFormControl.value);
    this.scoreFormControl.reset();

    this.localStorageService.saveGame(this.game);
  }

  revertScore() {
    this.game.revertScore(1);
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

  onInputDelete() {
    if (this.revertEnabled) {
      this.revertScore();
    } else if (this.scoreFormControl.value == null) {
      this.revertEnabled = true;
    }
  }

  onVkbDelete(changed: boolean) {
    if (!changed) {
      this.revertScore();
    }
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

  isActivePlayer(playerId: string) {
    if (!this.game) return false;
    return this.game.players[this.game.activePlayer]?.id === playerId
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .catch((err) => {
          console.error('error exiting fullscreen', err);
        });
    } else {
      document.documentElement.requestFullscreen()
        .catch((err) => {
          console.error('error entering fullscreen', err);
        });
    }
  }

  restartGame(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to restart this game? \nThe current progress will be discarded.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.game.restartGame();
      },
    });
  }

  newGame(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Leave this game and start a new one?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router.navigate(['new-game']).catch(console.error)
      },
    });
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

  private handleGameEvents(event: GameEvent) {
    switch (event) {
      case GameEvent.GAME_WIN:
        this.gameWon();
        break;
      case GameEvent.LEG_WIN:
        this.legWon();
        break;
      case GameEvent.SET_WIN:
        this.setWon();
        break;
      case GameEvent.BUST:
        this.playerBust();
        break;
      case GameEvent.RESTART:
        this.messageService.add({
          severity: 'info',
          summary: 'Game Restarted',
        });
        break;
    }
  }

  private gameWon() {
    this.messageService.add({
      severity: 'success',
      summary: 'Game Won',
      detail: `${this.game.players[this.game.activePlayer].name} won the game`,
      life: 10000,
    });
  }

  private legWon() {
    this.messageService.add({
      severity: 'success',
      summary: 'Leg Won',
      detail: `${this.game.players[this.game.activePlayer].name} won this leg`,
    });
  }

  private setWon() {
    this.messageService.add({
      severity: 'success',
      summary: 'Set Won',
      detail: `${this.game.players[this.game.activePlayer].name} won this set`,
    });
  }

  private playerBust() {
    this.messageService.add({
      severity: 'error',
      summary: 'Bust',
      detail: `${this.game.players[this.game.activePlayer].name}`,
    });
  }
}
