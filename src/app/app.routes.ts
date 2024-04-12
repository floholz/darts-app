import { Routes } from '@angular/router';
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {NewGamePageComponent} from "./pages/new-game-page/new-game-page.component";
import {PlayPageComponent} from "./pages/play-page/play-page.component";

export const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "new-game", component: NewGamePageComponent },
  { path: "play", component: PlayPageComponent },
  { path: "play/:score/:sets/:legs/:checkout", component: PlayPageComponent },
  { path: "**", redirectTo: "" },
];

