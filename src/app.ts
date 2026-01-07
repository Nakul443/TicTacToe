// app.ts - entry point for the server, creates server + socket
// name can be something else as well

/*
create express app
create http server
attach socket.io
load routes
*/

import express, { Request, Response } from 'express';
import { createServer } from "http";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ClassificationType } from 'typescript';

// import socket handler (we will create this file next)
import { gameSocketHandler } from "./sockets/gameSocket";

const app = express();
const port = 9001;
export const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(express.json());

// connect socket routes
gameSocketHandler(io);

// start server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { io };
export default app;
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------