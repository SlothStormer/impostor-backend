import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketLogic from "./socket.js";
import cors from "cors";
import { config } from "dotenv";
import { GameServer } from "./classes/Server.js";
import { SocketHandler } from "./classes/SocketHandler.js";

config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const gameServer = new GameServer();

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

new SocketHandler(io, gameServer).initialize();

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.PASSWORD) {
    res.send({ success: true, message: "Logeado correctamente" });
  } else {
    res.send({ success: false, message: "Contraseña incorrecta" });
  }
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
