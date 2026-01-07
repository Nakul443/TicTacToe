export interface BestMove {
  row: number;
  col: number;
}

export class GameUtils {
  public static checkValidity(userGrid : string[][], serverGrid: string[][]) : boolean {
    console.log(userGrid,serverGrid);
    // userGrid - latest updated
    // serverGrid - last move

    // validate grid, means check if the move is valid or not
  
    // two inputs - one grid from user and one grid inside the server
  
    // disparity > 1 then also problem
    // compare the two inputs to check for overwriting
    // this function will run everytime the user makes a move before the whole recursion process of the AI
    // disparity should not be zero or greater than 1
    // the new move should overwrite a dash
  
    
    // TO DO - if the input sent by the user is an actual grid or not
  
  
    // user should not place the symbol assigned to the AI
  
    let disparity = 0;
    for(let i = 0; i < userGrid.length; i++) {
      for(let j = 0; j < userGrid[0].length; j++) {
  
        if (userGrid[i][j] != serverGrid[i][j] && serverGrid[i][j] == '-') {
          // user has made a move
          if (userGrid[i][j] == 'X') return false;
          disparity++;
          // if(disparity > 1 || disparity == 0) {
          // case of making two moves at once
          // disparity = 0 means no move has been made by the player
          // socket.disconnect
          // }
        }
        if (userGrid[i][j] != serverGrid[i][j] && serverGrid[i][j] != '-') {
          // case of overwriting
          return false;
          // socket.disconnect
        }
      }
    }
    if (disparity == 1) return true;
    else return false;
  }

  // returns true if game is draw
  public static checkDraw(grid: string[][]): boolean {
    // check for draw
    let draw : boolean = true;
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[0].length; j++) {
        if(grid[i][j] == '-') {
          draw = false;
          break;
        }
      }
      if(!draw) return false;
    }
    if(draw) return true;
    return false;
  }

  // checks if the AI has won or not
  public static checkWin(grid : string[][], checkMark: string) : boolean {
  
    
    // 0 is draw
    // 1 is win
    // 2 is loss
    // 3 is continue
  
    // horizontal
    for(let i = 0; i < grid.length; i++) {
      let win : boolean = true;
      for(let j = 0; j < grid[0].length; j++) {
        if(grid[i][j] != checkMark) {
          win = false;
          break;
        }
      }
      if(win) return true;
    }
  
    // vertical
    for(let j = 0; j < grid[0].length; j++) {
      let win : boolean = true;
      for(let i = 0; i < grid.length; i++) {
        if(grid[i][j] != checkMark) {
          win = false;
          break;
        }
      }
      if(win) return true;
    }
  
    // diagonal
    let i = 0;
    let j = 0;
    let diagonal : boolean = true;
    while(i < grid.length && j < grid.length) {
      if(grid[i][j] != checkMark) {
        diagonal = false;
        break;
      }
      i++;
      j++;
    }
    if(diagonal) return true;
  
    i = 0;
    j = grid.length-1;
    diagonal = true;
    while(i < grid.length && j >= 0) {
      if(grid[i][j] != checkMark) {
        diagonal = false;
        break;
      }
      i++;
      j--;
    }
    if(diagonal) return true;
    
  
    return false;
  }
}