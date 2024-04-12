import { Component } from '@angular/core';
import {MessageService, PrimeIcons} from "primeng/api";
import {Router} from "@angular/router";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [
    ButtonModule
  ],
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  protected readonly PrimeIcons = PrimeIcons;

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService) { }

  navigateToNewGamePage(): void {
    this.router.navigate(['new-game'])
      .catch(err => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Routing Error', detail: 'Could not navigate to route' });
      });
  }
}
