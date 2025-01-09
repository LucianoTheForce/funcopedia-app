import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { id: username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { messages, isLoading, sendMessage } = useMessages(userId);
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
      if (!username) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('username', username)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setUserId(data.id);
          setReceiverProfile({
            username: data.username || username,
            avatar_url: data.avatar_url
          });
        } else {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
          navigate('/chats');
        }
      } catch (error) {
        console.error('Error fetching receiver profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      }
    };

    fetchReceiverProfile();
  }, [username, navigate, toast]);

  if (!username) {
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
            src={receiverProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-white font-semibold">{receiverProfile?.username || username}</h1>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      <MessageList messages={messages} userId={userId || ''} />
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;