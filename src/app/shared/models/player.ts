import {SetScores} from "./darts";

export type Player = {
  name: string,
  color: string,
}

export enum PlayerType  {
  HUMAN,
  BOT,
}

export type GamePlayer = {
  name: string,
  color: string,
  score: number,
  setsWon: number,
  legsWon: number,
  history: SetScores[]
}
