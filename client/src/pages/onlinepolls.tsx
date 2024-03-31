import { useState } from "react";
import { socket } from "../ws/socket";


// Voting started ->  [ votingtopic , pollid , {choices}]
// onSlug -> check if it exists , connect to the right room and get the voting data , sumbit vote and count it
// leaderboard -> after voting starting -> live results -> only admin can end the poll

export interface choiceInterface {
    content: string,
    vote: number
}

const OnlinePolls = () => {
    const [pollTopic, setPollTopic] = useState("");
    const [choices, setChoices] = useState<choiceInterface[]>([]);
    const [code, setCode] = useState("");
    const [status, setStatus] = useState(false);

    const ChoiceIncrement = () => {
        let tempChoices = [...choices];
        let incrementedIndex;
        console.log("before", choices.length)

        if (choices.length === 0) {
            incrementedIndex = 0;
            tempChoices[incrementedIndex] = { content: "", vote: 0 };
        }
        if (choices.length > 3) return;
        else {
            incrementedIndex = (choices.length - 1) + 1;
            console.log("IncrementedIndex", incrementedIndex);
            tempChoices[incrementedIndex] = { content: "", vote: 0 };
        }


        setChoices(tempChoices);
    }

    function choiceUpdated(index: any, value: any) {
        let tempChoices = [...choices];
        if (index >= 0 && index < tempChoices.length) {
            // Update the choice at the specified index with the new value
            tempChoices[index] = { content: value, vote: 0 };

            // Update the state with the new choices array
            setChoices(tempChoices);
        }
    }

    function generateRandomCode(length: number) {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * alphanumeric.length);
            code += alphanumeric.charAt(randomIndex);
        }

        return code;
    }

    const creatingPoll = () => {
        if (pollTopic === "" || choices.length < 1) return;
        if (status) return;

        const randomCode = generateRandomCode(6);
        setCode(randomCode);
        setStatus(true);

        const pollData: any = [randomCode, pollTopic, choices, status]

        socket.emit('POLLSTART', pollData);

    }

    const endPoll = () => {
        setStatus(false);
        socket.emit("POLLEND", [pollTopic, choices, status])
        console.log(choices);
    }




    return (
        <div className="flex justify-center h-screen space-y-4  items-center flex-col">
            <h1 className="text-6xl my-4 font-semibold">Start a online poll</h1>
            {status && <h3 className="text-lg">Share this code : <span className="border border-gray-500 p-2 rounded-md bg-gray-200 font-semibold">{code}</span></h3>}
            <input className="border border-gray-200 p-2 w-[300px] font-semibold" type="text" placeholder="Topic" value={pollTopic} onChange={(e) => setPollTopic(e.target.value)} />
            <div className="flex flex-col my-[1rem] space-y-4">
                {choices.map((choice, index) => {
                    return (
                        <div className="flex space-x-2">
                            <input type="radio" name="choice" value="Scripting" /><input type="text" placeholder={`choice-${index + 1}`} value={choice.content} onChange={(e) => { choiceUpdated(index, e.target.value) }} />
                        </div>
                    )
                })}
                <button onClick={ChoiceIncrement} className="text-white bg-indigo-500 rounded-md border-none px-6 py-3">Add Option +</button>



            </div>
            {status ? <button onClick={endPoll} className="text-white bg-red-600 rounded-md border-none px-6 py-3">End Poll </button> : <button onClick={creatingPoll} className="text-white bg-blue-600 rounded-md border-none px-6 py-3">Create Poll </button>}
        </div>
    )
}

export default OnlinePolls;
