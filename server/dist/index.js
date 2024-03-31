"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./IoManager");
const pollingManager_1 = require("./pollingManager");
const io = IoManager_1.IoManager.getIo();
io.listen(3000);
let currentPoll = [];
const pollingManager = new pollingManager_1.Polling();
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
    let conversation = [];
    socket.on("MESSAGESENT", ({ roomId, conversation: message, }) => {
        conversation.push(message);
        console.log(message, roomId);
        io.to(roomId).emit("MESSAGERECIEVED", conversation);
    });
});
