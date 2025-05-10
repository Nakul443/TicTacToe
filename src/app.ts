// app.ts - entry point for the server
// name can be something else as well

import express, { Request, Response } from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ClassificationType } from 'typescript';

const app = express();
const port = 9001;
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

enum Turn { // list of items
  //  enums improves code readability and maintainability by providing descriptive names for these values
  AI,
  USER
}

// first letter to be capital in interface
interface BestMove {
  row: number;
  col: number;
}

class Game {
  private serverGrid;
  private userMark = 'O'; // user is hardcoded to 'O'
  private AiMark = 'X';
  private curTurn = Turn.USER; // first turn will be of the user
  private userId: string;
  private socket: Socket; // socket is variable name that stores 'Socket' ('Socket' is a type), socket is basically a phoneline between user and server


  // passing socket as the argument to make user identification possible for the object
  // and to communicate with the user
  constructor (socket: Socket) {
    this.userId = socket.id; // uniquely generated id given to a particular useer
    this.socket = socket;
    this.serverGrid = [
      ['-','-','-'],
      ['-','-','-'],
      ['-','-','-']
    ];

    // sent to the user immediately after serverGrid is declared
    this.socket.emit('game', this.serverGrid); // 'game' is the name of the event, grid is the value returned
    // .emit sends a message to all the clients connected to it, basically serverGrid is sent to the user when the user connects to the 'game' event

    // if the server receives a message for the event 'game' then this will be executed
    // this is executed when the user specifies the event 'game' from postman
    this.socket.on('game', (message: string) => this.playGame(message));
    // socket.on is used to start listening for socket events when a particular event is started
  }

  // playGame is the function that contains all the game logic
  private playGame(message: string) : void {

    // message is the modified grid received from the user
    // networks sends data as a string or bytes, need to convert it to a readable form through JSON
    const userGrid: string[][] = JSON.parse(message) // converts string into array

    // console.log(userGrid,this.serverGrid,this.socket,this.userId);

    // check if the received message contains 'grid' or not
    // check if move is valid or not - continous moves, wrong symbol used, overwriting
    if(!GameUtils.checkValidity(userGrid,this.serverGrid)) {
      this.socket.emit('game',"Invalid Move");
      this.socket.disconnect();
    }

    // if valid, update the grid on the server
    this.serverGrid = userGrid;


    // check for win, loss
    let aiWin = GameUtils.checkWin(this.serverGrid,'X'); // checkWin function is called from GameUtils class, since the function is static then no need to create an object
    let userWin = GameUtils.checkWin(this.serverGrid, 'O');
    if((aiWin && !userWin) || (!aiWin && userWin) ) {
      this.socket.emit('game', "GAME OVER"); // give out message "GAME OVER" for the event 'game'
      this.socket.disconnect();
    }

    // check for draw
    if (GameUtils.checkDraw(this.serverGrid)) {
      this.socket.emit('game', "DRAW");
      this.socket.disconnect();
    }

    // AI will make its move
    // assume user is always 'O' and AI is 'X'
    // after AI makes its move, return the grid

    const aiMove: BestMove = AiUtils.findBestMove(this.serverGrid); // aiMove is a variable of type 'BestMove', so it can access all the features inside it
    // Function 'findBestMove' from Aiutils class is called
    this.serverGrid[aiMove.row][aiMove.col] = 'X';

    // check for win, loss
    aiWin = GameUtils.checkWin(this.serverGrid,'X');
    userWin = GameUtils.checkWin(this.serverGrid, 'O');
    if ((aiWin && !userWin) || (!aiWin && userWin)) {
      this.socket.emit('game', "GAME OVER");
      this.socket.emit('game', this.serverGrid); // return the grid to the user
      this.socket.disconnect();
    }

    // check for draw
    if (GameUtils.checkDraw(this.serverGrid)) {
      this.socket.emit('game', "DRAW");
      this.socket.emit('game', this.serverGrid); // return the grid to the user
      this.socket.disconnect();
    }

    this.socket.emit('game', this.serverGrid); // if there is no interruption, game continues
  }
}

// links socketid to game (the object) ('game' is the object of each user game)
const userGames = new Map<string, Game>();



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------





// SERVER START

// connection is received here through the socket
// when 'connection' event is received execute the function
io.on("connection", function (socket) {
  // Echo server
  // Echo back messages from the client
  // if message is received from postman then this is executed
  // if event name is not defined in postman, then 'message' is the default 'event name'
  socket.on('message', function (msg) { // msg contains the content of the data sent to server. It can be 'hi' hello anything.
    console.log("Got message: " + msg);
    socket.emit('message', msg); // 'emit' used to send data back to the user
    // msg will be sent to the user connected through the event 'message'
  });



  // someone connected
  console.log(socket.id);
  console.log("Someone just connected!");
  const game = new Game(socket); // game is a variable of type 'Game', game is an instance of 'Game' class
  userGames.set(socket.id,game); // maps the socketid to game (object)
});

// everytime a new user connects, a user connects through a socket and each socket has a unique id



class GameUtils {
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

class AiUtils {
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



httpServer.listen(port);