import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketLogic from "./socket.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let serverState = {
  players: [],
  alreadyPlayed: [],
  gameState: {
    mode: "WITH_HOST", // Posibles: "WITH_HOST", "WITHOUT_HOST"
    roundHost: {
      username: "",
      id: "",
    },
    stage: "BOOKING", // Posibles: "BOOKING", "PREROUND", "ROUND", "FINISH"
    hostItem: "",
    impostor: "",
    items: [],
  },
};

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Range"],
    exposedHeaders: ["Content-Range", "Accept-Ranges"],
  })
);
app.use(
  express.static("public", {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

socketLogic(io, serverState);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
