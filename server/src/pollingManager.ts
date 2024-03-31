import { Socket } from "socket.io";
import { IoManager } from "./IoManager";

const io = IoManager.getIo();

interface choiceInterface {
  content: string;
  vote: number;
}

export class Polling {
  // starting of poll
  startPolling(data: any) {
    const [pollId, pollTopic, choices, status] = data;
    console.log(data);
    console.log("data reached ->", pollId, pollTopic);
    io.emit("POLLSTARTED", data);
  }

  // ending poll
  endPolling(data: any) {
    io.emit("POLLENDED", data);
  }

  // showing realtime results

  // voting on a poll
  votingPoll(data: any) {
    const [pollId, choices, selectedChoiceIndex]: [
      string,
      choiceInterface[],
      number
    ] = data;
    const tempChoices = [...choices];
    tempChoices[selectedChoiceIndex] = {
      ...tempChoices[selectedChoiceIndex], // Copy existing properties
      vote: tempChoices[selectedChoiceIndex].vote + 1,
    };

    console.log(tempChoices);
    io.emit("VOTING_UPDATED", tempChoices);
  }
}
