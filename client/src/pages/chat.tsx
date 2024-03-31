import { useEffect, useState } from 'react'
import { socket } from '../ws/socket';

interface conversation {
    name: string,
    content: string
}

function ChatPage() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [conversationHistory, setConversationHistory] = useState<conversation[]>([]);
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [roomId, setRoomId] = useState("");

    useEffect(() => {

        socket.on("MESSAGERECIEVED", (receivedMessage: conversation[]) => {
            console.log("Received message:", receivedMessage);
            setConversationHistory(receivedMessage);
            // Handle received message, for example, update UI state
        });

        return () => {
            socket.off('MESSAGERECIEVED');
        };
    }, []);

    const loggingIn = () => {
        if (roomId === "") return;
        socket.emit("joinRoom", roomId);
        setLoggedIn(true);
    }

    const sendMessage = () => {
        if (name === "" || message === "") return;
        const conversation = { name, message }
        const data = { roomId, conversation };
        socket.emit('MESSAGESENT', data);
    }

    if (!loggedIn) return (
        <>
            <h1>Enter roomId</h1>
            <input type="text" name="roomId" id="roomId" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="room id" />
            <button onClick={loggingIn}>Enter roomId</button>

        </>
    )


    return (
        <>
            <h1>realtime chat application</h1>
            {JSON.stringify(conversationHistory)}
            <input type="text" name="username" id="username" value={name} onChange={(e) => setName(e.target.value)} placeholder='user name' />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send message</button>
        </>
    )
}

export default ChatPage
