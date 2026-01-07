import { GameUtils } from "./gameutils";

export interface BestMove {
  row: number;
  col: number;
}

export class AiUtils {
  // all the AI related functions are clubbed inside this class

  // static - no need make an object for a class
  private static AImove(grid : string[][], player: boolean) : number {
    // this is only for the server, no need for the user to see this


    // minmax
    // if isTerminalState(grid) --> return value of state
    /* 
    if player: // X
      value = -1 
      for possibleState in nextStates(grid):
        value = max(value, AImove(possibleState, player * -1))
    else:
      value = INT_MAX
      for possibleState in nextStates(grid):
        value = min(value, AImove(possibleState, player * -1))
  */


  console.log('player: ', player);
    if (GameUtils.checkWin(grid, 'X')) {
      console.log('AI Wins', grid);
      return 1;
    }
    if (GameUtils.checkWin(grid, 'O')) {
      console.log('User wins', grid);
      return -1;
    }
    if (GameUtils.checkDraw(grid)) {
      console.log('draw', grid);
      return 0;
    }
    if (player) {
      // AI move
      let best = -1000;
  
      // traverse all cells
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          // if the current cell is empty
          if (grid[i][j] === '-') {
            grid[i][j] = 'X'; // AI makes its move
  
            // make the recursive call
            best = Math.max(best, this.AImove(grid, !player));         
            grid[i][j] = '-'; // backtracking, revert the changes made
          }
        }
      }
      return best;
    } else {
      let best = 1000;
  
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          // check if current cell is empty
          if (grid[i][j] === '-') {
            grid[i][j] = 'O'; // player makes its move
            console.log('player moves');
            // make the recursive call
            best = Math.min(best, this.AImove(grid, !player));
            grid[i][j] = '-'; // revert the changes, backtrack
          }
        }
      }
      return best;
    }
  }

  public static findBestMove(board : string[][]) : BestMove {
    let bestRow = -1;
    let bestCol = -1;
    let bestVal = -100000;
  
    // console.log('board');
    // console.log(board);
    // traverse through the board and find empty cells to fill in the space
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        // if there's an empty space
        if (board[i][j] === '-') {
          board[i][j] = 'X'; // assuming AI makes the move
  
          let moveVal = this.AImove(board,false); // false because AI already made it's move. Now calculation will start from the user's move.
          console.log(i, j, moveVal);
          board[i][j] = '-'; // revert the changes made, backtracking
  
          if (moveVal > bestVal) {
            bestRow = i; // update the row
            bestCol = j; // update the col
            bestVal = moveVal;
          }
        }
      }
    }
  
    return {
      row: bestRow,
      col: bestCol
    };
  }
}