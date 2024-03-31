import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../ws/socket";
import { choiceInterface } from "./onlinepolls";



const OnlinePollsVoting = () => {
    const { id } = useParams();
    const [pollTopic, setPollTopic] = useState("");
    const [choices, setChoices] = useState<choiceInterface[]>([]);
    const [code, setCode] = useState("");
    const [status, setStatus] = useState(false);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
    useEffect(() => {
        socket.on("POLLSTARTED", (data) => {
            console.log(data);
            console.log(data[1]);
            setChoices(data[2]);
            setPollTopic(data[1]);
            setStatus(data[3]);
            setCode(data[0])
        });

        socket.on("VOTING_UPDATED", (data) => {
            console.log("voting updated ->", data);
            setChoices(data);
        })
        socket.on("POLLENDED", (data) => {
            console.log("ended with results -> ", data);
            setChoices(data[2]);
            setPollTopic(data[1]);
            setStatus(data[3]);
            setCode(data[0])
        })


    }, []);

    const choiceSelected = (index: number) => {
        setSelectedChoiceIndex(index);

    }
    const submitVote = () => {
        console.log(selectedChoiceIndex);
        if (selectedChoiceIndex === null) return;
        socket.emit('VOTED', [code, choices, selectedChoiceIndex]);


    }
    if (status) return <h1 className="text-3xl font-bold">Poll ended</h1>
    else
        return (
            <div className="flex justify-center h-screen space-y-4  items-center flex-col">
                <h2 className="text-3xl "> Poll id - {id}</h2>
                <h3 className="text-lg">Share this code : <span className="border border-gray-500 p-2 rounded-md bg-gray-200 font-semibold">{code}</span></h3>
                <h2 className="text-3xl "> Topic - {pollTopic}</h2>
                <form className="flex flex-col my-[1rem] space-y-4">

                    {choices.map((choice, index) => {
                        return (
                            <div className="flex space-x-2">
                                <input onChange={(e) => {
                                    console.log(index);
                                    choiceSelected(index)
                                }} type="radio" name="choice" value="Scripting" /><input type="text" placeholder={`choice-${index + 1}`} value={choice.content} />
                            </div>
                        )
                    })}
                </form>
                <button onClick={() => submitVote()} className="text-white bg-blue-600 rounded-md border-none px-6 py-3">Sumbit Vote ! </button>

            </div>
        )
}

export default OnlinePollsVoting;
