import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';

const socket = io.connect("https://chat-stream-55p3.onrender.com");

function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: "Me",
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      socket.emit('send_message', messageData); 

      // Update our own list immediately
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {

    
    // --- WRITE YOUR CODE BELOW THIS LINE ---
    socket.on('receive_message', (data) => {
       setMessageList((list) => [...list, data]);
    });

    // Cleanup to prevent double messages
    return () => socket.off('receive_message');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl overflow-hidden h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-700 p-4 flex items-center gap-2 border-b border-slate-600">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Global Chat</h3>
            <p className="text-xs text-slate-400">Live • {messageList.length} Messages</p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-600">
          {messageList.map((msg, index) => {
             const isMe = msg.author === "Me";
             return (
               <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                 <div className={`max-w-[70%] rounded-2xl p-3 ${isMe ? "bg-emerald-600 text-white rounded-br-none" : "bg-slate-700 text-slate-200 rounded-bl-none"}`}>
                   <p className="text-sm">{msg.message}</p>
                   <p className="text-[10px] opacity-70 mt-1 text-right">{msg.time}</p>
                 </div>
               </div>
             );
          })}
        </div>

        {/* Footer / Input */}
        <div className="p-4 bg-slate-700 flex gap-2">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type a message..."
            className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-full transition-all active:scale-95">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;