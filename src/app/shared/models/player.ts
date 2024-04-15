import {SetScores} from "./darts";
import {Params} from "@angular/router";
import {isHexColor, randomColor} from "../utils/utils";

export type Player = {
  name: string,
  color: string,
}

export enum PlayerType  {
  HUMAN,
  BOT,
}

export type GamePlayer = {
  id: string,
  name: string,
  color: string,
  score: number,
  setsWon: number,
  legsWon: number,
  history: SetScores[]
}

export function parsePlayersFromQueryParams(params: Params): Player[] {
  const players: Player[] = [];
  let idx = 1;
  let tempPlayer = buildPlayerFromString(params[`p${idx}`]);
  while(tempPlayer) {
    players.push(tempPlayer);
    idx++;
    tempPlayer = buildPlayerFromString(params[`p${idx}`]);
  }
  return players;
}

export function sanitizePlayerQueryParams(params: Params): [Params, number, number] {
  const sanitizedParams: Params = {};
  const playerParams: Params = {};
  const re = new RegExp(/^p[0-9]+$/);
  for (let key of Object.keys(params)) {
    if (re.test(key)) {
      playerParams[key] = params[key];
    } else {
      sanitizedParams[key] = params[key];
    }
  }
  let ignoreFromNowOn = false;
  let idx = 1;
  let numPlayers = 0;
  let numStripped = 0;
  const sortedPKeys = Object.keys(playerParams).sort((a, b) => {
    const numA = Number(a.slice(1));
    const numB = Number(b.slice(1));
    if (numA < numB) {
      return -1;
    }
    if (numA > numB) {
      return 1;
    }
    return 0;
  });
  for (let key of sortedPKeys) {
    if (ignoreFromNowOn || key !== `p${idx}` || !validatePlayerQueryParam(params[key])) {
      ignoreFromNowOn = true;
      numStripped++;
      continue;
    }
    idx++;
    numPlayers++;
  }
  return [sanitizedParams, numPlayers, numStripped];
}

export function genPlayerQueryParams(num: number): string[] {
  const playerQueries: string[] = [];
  for (let i = 0; i < num; i++) {
    playerQueries.push(`${randomColor()}Player${i+1}`);
  }
  return playerQueries;
}

function buildPlayerFromString(str: string): Player | null {
  if (!validatePlayerQueryParam(str)) {
    return null;
  }
  return { color: str.slice(0, 7), name: str.slice(7) };
}

export function validatePlayerQueryParam(str: string): boolean {
  const re = new RegExp(/^#?[0-9a-fA-F]{6}\w.*$/);
  return re.test(str);
}

export function buildQueryParamsFromPlayers(players: Player[]): Params {
  const params: Params = {};
  for (let i = 0; i < players.length; i++) {
    params[`p${i+1}`] = players[i].color + players[i].name;
  }
  return params;
}
