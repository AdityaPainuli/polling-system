"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polling = void 0;
const IoManager_1 = require("./IoManager");
const io = IoManager_1.IoManager.getIo();
class Polling {
    // starting of poll
    startPolling(data) {
        const [pollId, pollTopic, choices, status] = data;
        console.log(data);
        console.log("data reached ->", pollId, pollTopic);
        io.emit("POLLSTARTED", data);
    }
    // ending poll
    endPolling(data) {
        io.emit("POLLENDED", data);
    }
    // showing realtime results
    // voting on a poll
    votingPoll(data) {
        const [pollId, choices, selectedChoiceIndex] = data;
        const tempChoices = [...choices];
        tempChoices[selectedChoiceIndex] = Object.assign(Object.assign({}, tempChoices[selectedChoiceIndex]), { vote: tempChoices[selectedChoiceIndex].vote + 1 });
        console.log(tempChoices);
        io.emit("VOTING_UPDATED", tempChoices);
    }
}
exports.Polling = Polling;
