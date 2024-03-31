"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./IoManager");
const io = IoManager_1.IoManager.getIo();
// creation of poll
io.on("POLLSTART", (data) => {
    console.log("data -> ", data);
});
// ending poll
// showing realtime results
// voting on a poll
