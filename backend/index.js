// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: true
});

const roomMap = new Map(); 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on('join', ({ room }) => {
    socket.join(room);
    if (!roomMap.has(room)) roomMap.set(room, [socket.id]);
    else roomMap.set(room, [...roomMap.get(room), socket.id]);
    const otherSocketId = roomMap.get(room).filter(id => id !== socket.id);
    if(roomMap.get(room).length > 1) io.to(otherSocketId).emit('joinedRoom', {room})
    console.log(`User ${socket.id} joined room: ${room}`);
  }); 

  socket.on('offer', ({ offer, room }) => {
    console.log(offer)
    const otherSocketId = roomMap.get(room).filter(id => id !== socket.id);
    socket.to(otherSocketId).emit('offer', { offer, room });
  });

  socket.on('answer', ({ answer, room }) => {
    const otherSocketId = roomMap.get(room).filter(id => id !== socket.id);
    socket.to(otherSocketId).emit('answer', { answer, room });
  });

  socket.on("ice-candidate", ({ candidate, room }) => {
    console.log("Relaying ICE candidate to room:", room);
    socket.to(room).emit("ice-candidate", { candidate });
  });

//   socket.on("leave", ({ room }) => {
//   console.log(`User ${socket.id} left room: ${room}`);
//   socket.leave(room);

//   if (roomMap.has(room)) {
//     const filtered = roomMap.get(room).filter(id => id !== socket.id);

//     if (filtered.length === 0) { 
//       roomMap.delete(room); // ✅ remove room if empty
//       console.log(`Room ${room} deleted`);
//     } else {
//       roomMap.set(room, filtered);
//     }
//   }
// });


  socket.on("disconnect", () => {
     for (let [roomName, members] of roomMap.entries()) {
      const filtered = members.filter(m => m !== socket.id);
      if (filtered.length === 0) {
        roomMap.delete(roomName);
      } else {
        roomMap.set(roomName, filtered);
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Signaling server running on http://localhost:5000");
}); 