import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { MoreVertical } from "lucide-react";

const Chats = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chats' | 'taps' | 'views'>('chats');

  const chats = [
    {
      id: 1,
      name: "Brodi",
      lastMessage: "Hey! How's it going? 😊",
      time: "2min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brodi"
    },
    {
      id: 2,
      name: "Thomas",
      lastMessage: "I'm good, you? 🤗",
      time: "20min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas"
    },
    {
      id: 3,
      name: "Jim",
      lastMessage: "What's new here?",
      time: "1hr ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jim"
    }
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="sticky top-0 bg-black/95 backdrop-blur-lg z-10">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <button>
            <MoreVertical className="text-white" />
          </button>
        </div>
        
        <div className="flex gap-6 px-4 border-b border-gray-800">
          {(['chats', 'taps', 'views'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 capitalize ${
                activeTab === tab
                  ? 'text-white border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 mt-4">
        <div className="space-y-4">
          {chats.map((chat) => (
            <button
              key={chat.id}
              className="flex items-center gap-3 w-full text-left"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={chat.avatar} alt={chat.name} />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{chat.name}</span>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Chats;