import { useParams } from "react-router-dom";
import { Camera, Send, Type } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const { userId } = useParams();

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <Avatar className="w-10 h-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-white font-semibold">Chat</h1>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <div className="bg-gray-800 text-white p-3 rounded-lg self-start max-w-[80%]">
            Hey, how's it going?
          </div>
          <span className="text-xs text-gray-500">10:41</span>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <div className="bg-orange-500 text-white p-3 rounded-lg self-end max-w-[80%]">
            Yea, I'm good, you?
          </div>
          <span className="text-xs text-gray-500">10:42</span>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Camera className="w-5 h-5 mr-2" />
            Expiring Photo
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="text-orange-500">
            <Type className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" className="text-gray-400">
            <Camera className="w-5 h-5" />
          </Button>
          <Input 
            placeholder="Message..." 
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button size="icon" className="bg-orange-500 hover:bg-orange-600">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;