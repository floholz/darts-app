import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {InputSwitchModule} from "primeng/inputswitch";
import {FloatLabelModule} from "primeng/floatlabel";
import {DropdownModule} from "primeng/dropdown";
import {PrimeIcons} from "primeng/api";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf, NgIf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {ColorPickerModule} from "primeng/colorpicker";
import {Params, Router} from "@angular/router";
import {Player} from "../../shared/models/player";
import {Checkout} from "../../shared/models/darts";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-game-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectButtonModule,
    InputSwitchModule,
    FloatLabelModule,
    DropdownModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    NgIf,
    RippleModule,
    NgForOf,
    ColorPickerModule
  ],
  templateUrl: './new-game-page.component.html',
  styleUrl: './new-game-page.component.scss'
})
export class NewGamePageComponent implements OnInit{

  newGameForm!: FormGroup;

  protected readonly PrimeIcons = PrimeIcons;

  protected readonly scoreOptions = [
    { name: '101', value: 101},
    { name: '301', value: 301},
    { name: '501', value: 501},
    { name: '701', value: 701},
    { name: '1001', value: 1001},
  ];

  protected readonly outOptions = [
    { name: 'Single', value: Checkout.SINGLE},
    { name: 'Double', value: Checkout.DOUBLE},
    { name: 'Triple', value: Checkout.TRIPLE},
  ];

  protected players: Player[] = [
    {name: 'Player 1', color: '#fbbf24'},
  ]

  private rollingPlayerCnt = 1;

  constructor(private readonly router: Router,) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  startGame() {
    console.log('start game');

    this.router.navigate([
      'play',
      this.newGameForm.controls['score'].value,
      this.newGameForm.controls['sets'].value,
      this.newGameForm.controls['legs'].value,
      this.newGameForm.controls['checkout'].value,
      uuidv4(),
    ], {
      queryParams: this.buildQueryParams(),
    }).catch(err => console.log(err));
  }

  onPlayerAdd() {
    this.rollingPlayerCnt++;
    this.players.push({name: `Player ${this.rollingPlayerCnt}`, color: '#fbbf24'});
    console.log(this.players);
  }

  onPLayerDelete(ri: any) {
    this.players.splice(ri, 1);
  }

  private initForm() {
    this.newGameForm = new FormGroup({
      score: new FormControl(501),
      sets: new FormControl(1),
      legs: new FormControl(1),
      checkout: new FormControl(Checkout.DOUBLE),
    });
  }

  private buildQueryParams(): Params {
    const params: Params = {}
    this.players.forEach((player, index) => {
      params[`p${index+1}`] = player.color + player.name;
    })
    return params;
  }
}
