import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/chat';
import OnlinePolls from './pages/onlinepolls';
import OnlinePollsVoting from './pages/OnlinePollsVoting';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onlinepolls" element={<OnlinePolls />} />
        <Route path="/onlinepolls/:id" element={<OnlinePollsVoting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
