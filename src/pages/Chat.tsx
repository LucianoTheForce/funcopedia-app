import { useParams, useNavigate } from "react-router-dom";
import { Camera, Send, Type, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id || !userId) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${session.session.user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${session.session.user.id})`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();
  }, [userId, toast]);

  // Subscribe to new messages
  useEffect(() => {
    const { data: session } = supabase.auth.getSession();
    if (!session || !userId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${userId},receiver_id=eq.${session.user?.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    setIsLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage.trim(),
      sender_id: session.session.user.id,
      receiver_id: userId,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    } else {
      setNewMessage("");
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-white hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 ${
              message.sender_id === userId ? "" : "items-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.sender_id === userId
                  ? "bg-gray-800 text-white self-start"
                  : "bg-orange-500 text-white self-end"
              }`}
            >
              {message.content}
            </div>
            <span className="text-xs text-gray-500">
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={sendMessage}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;