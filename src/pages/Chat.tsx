import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useMessages(userId);

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
          />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-white font-semibold">Chat</h1>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} userId={userId || ""} />

      {/* Input */}
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;