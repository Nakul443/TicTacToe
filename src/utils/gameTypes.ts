export enum Turn { // list of items
  //  enums improves code readability and maintainability by providing descriptive names for these values
  AI,
  USER
}

// first letter to be capital in interface
export interface BestMove {
  row: number;
  col: number;
}

export type Grid = string[][];