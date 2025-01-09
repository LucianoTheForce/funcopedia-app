import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useMessages(id);
  const [receiverProfile, setReceiverProfile] = useState<{ username: string; avatar_url: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchReceiverProfile = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching receiver profile:', error);
        return;
      }
      
      if (data) {
        setReceiverProfile(data);
      }
    };

    fetchReceiverProfile();
  }, [id]);

  if (!id) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chats")}
          className="text-white hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={receiverProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`}
          />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-white font-semibold">{receiverProfile?.username || 'Chat'}</h1>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      <MessageList messages={messages} userId={id} />
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;