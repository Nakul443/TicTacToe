# TicTacToe

A real-time Tic-Tac-Toe game server built with TypeScript, Express.js, and Socket.IO. Play against an intelligent AI opponent that uses the Minimax algorithm for optimal gameplay.

## Features

- 🎮 **Real-time multiplayer gameplay** using WebSocket connections
- 🤖 **AI opponent** powered by the Minimax algorithm (unbeatable AI)
- ✅ **Move validation** to ensure fair play
- 🏆 **Win detection** for rows, columns, and diagonals
- 🤝 **Draw detection** for tied games
- 🔌 **Socket.IO integration** for seamless real-time communication
- 📝 **TypeScript** for type-safe development

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time Communication**: Socket.IO
- **Language**: TypeScript
- **Build Tool**: TypeScript Compiler (tsc)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nakul443/TicTacToe.git
   cd TicTacToe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Quick start

Run everything locally in one go:
```bash
npm install
npm start
```

## Running the Server

1. **Start the server**
   ```bash
   npm start
   ```

   This will:
   - Compile TypeScript files to JavaScript
   - Start the server on port `9001`

2. **The server is now running and ready to accept WebSocket connections**

### Configuration

- The server binds to port `9001` as defined in `src/app.ts`. Update the `port` constant there if you need a different port.

## How It Works

### Game Flow

1. A client connects to the server via WebSocket
2. The server initializes a new game instance and sends an empty 3x3 grid
3. The player (O) makes their move by sending the updated grid
4. The server validates the move
5. The AI (X) calculates and makes the best move using Minimax algorithm
6. The updated grid is sent back to the client
7. The game continues until a win, loss, or draw

### Socket Events

#### Client to Server

- **`game`**: Send the updated game grid after making a move
  ```javascript
  socket.emit('game', JSON.stringify(grid));
  ```

- **`message`**: Send a test message (echo server functionality)
  ```javascript
  socket.emit('message', 'Hello Server!');
  ```

#### Server to Client

- **`game`**: Receive game state updates
  - Empty grid when connecting
  - Updated grid after each move
  - "Invalid Move" if move validation fails
  - "GAME OVER" when game ends
  - "DRAW" when game results in a tie

### Game Rules

- **Player (O)**: Always goes first
- **AI (X)**: Makes optimal moves using Minimax algorithm
- **Grid Format**: 3x3 array where `'-'` represents empty cells
- **Move Validation**:
  - Only one move per turn allowed
  - Cannot overwrite existing moves
  - Player cannot use AI's mark (X)

## Project Structure

```
TicTacToe/
├── src/
│   ├── app.ts          # HTTP server + Socket.IO bootstrap
│   ├── server.ts       # (If used) alternative server entry
│   ├── sockets/
│   │   └── gameSocket.ts  # Socket.IO event handlers for the game
│   ├── auth/           # Authentication-related logic (if implemented)
│   ├── game/           # Core game domain logic (e.g., Game, GameUtils, AiUtils)
│   ├── middleware/     # Express middlewares (logging, auth, etc.)
│   ├── routes/         # HTTP route handlers
│   └── utils/          # Shared utilities/helpers
├── dist/               # Compiled JavaScript output
├── node_modules/       # Dependencies
├── package.json        # Project configuration and dependencies
├── package-lock.json   # Locked dependency tree
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Game Classes

### `Game`
Main game class that manages individual game sessions:
- Manages game state and grid
- Handles player moves
- Coordinates with AI for opponent moves
- Validates moves and checks win conditions

### `GameUtils`
Utility class with static methods:
- `checkValidity()`: Validates player moves
- `checkWin()`: Checks for winning conditions
- `checkDraw()`: Detects draw scenarios

### `AiUtils`
AI implementation using Minimax algorithm:
- `findBestMove()`: Finds optimal move for AI
- `AImove()`: Recursive Minimax implementation

## Development

### Available npm scripts

- `npm start`: Compile TypeScript and start the server (`npx tsc; node dist/app.js`).
- `npm test`: Placeholder script (currently exits with an error).

### Building the Project

```bash
npx tsc
```

This compiles TypeScript files from `src/` to JavaScript in `dist/`.

### TypeScript Configuration

The project uses TypeScript with:
- Target: ES6
- Module: CommonJS
- Source maps enabled
- Output directory: `dist/`

## Testing the Server

You can test the WebSocket server using:
- **Postman**: Use the WebSocket feature to connect to `ws://localhost:9001`
- **Browser console**: Connect using Socket.IO client library
- **Custom client**: Build your own frontend using Socket.IO client

Example connection:
```javascript
const socket = io('http://localhost:9001');

socket.on('game', (data) => {
  console.log('Game state:', data);
});

// Send a move
socket.emit('game', JSON.stringify([
  ['O', '-', '-'],
  ['-', '-', '-'],
  ['-', '-', '-']
]));
```

## License

ISC

## Repository

- **GitHub**: https://github.com/Nakul443/TicTacToe
- **Issues**: https://github.com/Nakul443/TicTacToe/issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.