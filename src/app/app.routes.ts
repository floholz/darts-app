import { Routes } from '@angular/router';
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {NewGamePageComponent} from "./pages/new-game-page/new-game-page.component";
import {PlayPageComponent} from "./pages/play-page/play-page.component";
import {gameUuidGuard} from "./shared/guards/game-uuid.guard";

export const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "new-game", component: NewGamePageComponent },
  { path: "play", redirectTo: "new-game" },
  { path: "play/:score/:sets/:legs/:checkout", canActivate: [gameUuidGuard], component: PlayPageComponent },
  { path: "play/:score/:sets/:legs/:checkout/:uuid", component: PlayPageComponent },
  { path: "**", redirectTo: "" },
];

