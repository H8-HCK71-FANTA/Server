const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const messages = [
  {
    sender: "system",
    text: "Hello World!",
  },
];

const rooms = []

io.on("connection", (socket) => {
  socket.user = {
    id: socket.id,
    name: ""
  }

  socket.on("Set-Nick", nick => {
    socket.user.name = nick
  })

  socket.on("Join-Room", room => {
    socket.join(room)
  })

  socket.on("Leave-Room", room => {
    socket.leave(room)
  })

  socket.on("generate-shuffled-card", () => {
    const cardImages = [
      { src: "/img/helmet-1.png", matched: false },
      { src: "/img/potion-1.png", matched: false },
      { src: "/img/ring-1.png", matched: false },
      { src: "/img/scroll-1.png", matched: false },
      { src: "/img/shield-1.png", matched: false },
      { src: "/img/sword-1.png", matched: false },
    ];

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    // console.log(shuffledCards);

    io.to("room_1").emit("game-board-created", shuffledCards)
  })

  socket.emit("messages", messages);

  // 2. server menerima pesan nya dari client
  // NOTE: nama event harus sama
  socket.on("messages:post", (body) => {
    // 2.5 di masukin doang ke array
    messages.push(body);

    // 3. kita kirim messages yang udah diupdate
    io.emit("messages", messages);
  });

  // ------------------------------------------


  socket.on("cards:post", (body) => {
    // 2.5 di masukin doang ke array
    // messages.push(body);
    console.log(body.data, "<<<< ini data dari client");

    // 3. kita kirim messages yang udah diupdate
    io.emit("cards", cards);
  });
});




httpServer.listen(3000, () => {
  console.log("Bisaaaa booss");
});
