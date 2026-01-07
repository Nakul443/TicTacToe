// listens for socket connections

import { io } from "../app";
import { Server } from "socket.io";
import { Game } from "../game/game";

export const userGames = new Map<string, any>();


// SERVER START

export function gameSocketHandler(io: Server) {
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
}

// everytime a new user connects, a user connects through a socket and each socket has a unique id