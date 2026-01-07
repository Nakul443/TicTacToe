// manages game session


import { Socket } from "socket.io";
// in Game.ts / gameController.ts
import { AiUtils } from "./aiUtils";
import { GameUtils } from "./gameutils";
import { Turn, BestMove } from "../utils/gameTypes"; // Add this


export class Game {
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

