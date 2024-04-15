import { Routes } from '@angular/router';
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {NewGamePageComponent} from "./pages/new-game-page/new-game-page.component";
import {PlayPageComponent} from "./pages/play-page/play-page.component";
import {gameUuidGuard} from "./shared/guards/game-uuid.guard";
import {playerGenGuard} from "./shared/guards/player-gen.guard";
import {savedGameResolver} from "./shared/resolver/saved-game.resolver";

export const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "new-game", component: NewGamePageComponent },
  { path: "play", redirectTo: "new-game" },
  { path: "play/:score/:sets/:legs/:checkout", canActivate: [gameUuidGuard], children: [] },
  { path: "play/:score/:sets/:legs/:checkout/:uuid", canActivate: [playerGenGuard], resolve: {
    game: savedGameResolver
    }, component: PlayPageComponent },
  { path: "**", redirectTo: "" },
];

