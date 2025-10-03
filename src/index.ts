import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketLogic from "./socket.js";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let serverState: ServerState = {
  players: [],
  alreadyPlayed: [],
  gameState: {
    mode: "WITH_HOST", // Posibles: "WITH_HOST", "WITHOUT_HOST"
    roundHost: {
      username: "",
      id: "",
      isOnline: false,
    },
    stage: "BOOKING", // Posibles: "BOOKING", "PREROUND", "ROUND", "FINISH"
    hostItem: { username: "", hint: "", item: "" },
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
