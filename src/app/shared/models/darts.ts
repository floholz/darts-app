export type DartsConfig = {
  score: 101 | 301 | 501 | 701 | 1001,
  sets: number,
  legs: number,
  checkout: Checkout,
}

export enum Checkout {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
}
