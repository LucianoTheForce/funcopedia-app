import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Send, Type } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={handleSend}
          disabled={isLoading}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};