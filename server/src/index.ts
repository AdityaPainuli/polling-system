import { createServer } from "http";
import { Server } from "socket.io";
import { IoManager } from "./IoManager";
import { Polling } from "./pollingManager";

const io = IoManager.getIo();

interface Conversation {
  name: string;
  content: string;
}

io.listen(3000);

let currentPoll: any = [];

const pollingManager = new Polling();

io.on("connection", (socket) => {
  // polling
  socket.on("POLLSTART", (data) => {
    currentPoll = [...data];
    pollingManager.startPolling(currentPoll);
  });

  socket.on("POLLEND", (data) => {
    pollingManager.endPolling(data);
  });

  socket.on("VOTED", (data) => {
    pollingManager.votingPoll(data);
  });

  // sending message
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined ->", roomId);
  });
  let conversation: Conversation[] = [];

  socket.on(
    "MESSAGESENT",
    ({
      roomId,
      conversation: message,
    }: {
      conversation: Conversation;
      roomId: string;
    }) => {
      conversation.push(message);
      console.log(message, roomId);
      io.to(roomId).emit("MESSAGERECIEVED", conversation);
    }
  );
});
