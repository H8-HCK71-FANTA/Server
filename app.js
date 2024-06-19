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

io.on("connection", (socket) => {
  // ...

  console.log(socket.id, "a user connected");

  socket.emit("messages", messages);

  // 2. server menerima pesan nya dari client
  // NOTE: nama event harus sama
  socket.on("messages:post", (body) => {
    // 2.5 di masukin doang ke array
    messages.push(body);

    // 3. kita kirim messages yang udah diupdate
    io.emit("messages", messages);
  });
});

httpServer.listen(3000, () => {
  console.log("Bisaaaa booss");
});
