import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {buildQueryParamsFromPlayers} from "../../shared/models/player";
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
import {CarouselModule} from "primeng/carousel";
import {DividerModule} from "primeng/divider";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {KBCode} from "../../shared/models/kb-code";
import {pairwise, startWith, Subject, takeUntil} from "rxjs";

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
export class PlayPageComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('scoreArea', { static: false }) scoreArea!: ElementRef<HTMLDivElement>;

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
  ) {
    this.showVirtualKeyboard = deviceService.isMobile() || deviceService.isTablet();
    console.log(deviceService.getDeviceInfo());

    this.game = Game.parseGame(activatedRoute.snapshot.data['game']);
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

  isActivePlayer(playerId: string) {
    if (!this.game) return false;
    return this.game.players[this.game.activePlayer]?.id === playerId
  }
}
