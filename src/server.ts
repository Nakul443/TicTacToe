import app, { httpServer } from "./app";

const port = 9001;

httpServer.listen(port, () => {
  console.log(`Server running on ${port}`);
});