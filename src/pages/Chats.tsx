import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatPreview {
  id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_message_time: string;
}

const Chats = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chats' | 'taps' | 'views'>('chats');
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;

        if (!currentUserId) {
          navigate('/auth');
          return;
        }

        // Fetch latest message for each conversation
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            profiles!messages_receiver_id_fkey (username, avatar_url)
          `)
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process messages to get unique conversations
        const conversationsMap = new Map<string, ChatPreview>();
        
        messages?.forEach(message => {
          const otherUserId = message.sender_id === currentUserId 
            ? message.receiver_id 
            : message.sender_id;
          
          if (!conversationsMap.has(otherUserId)) {
            const profile = message.profiles;
            conversationsMap.set(otherUserId, {
              id: otherUserId,
              username: profile?.username || 'Unknown User',
              avatar_url: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
              last_message: message.content,
              last_message_time: formatMessageTime(message.created_at),
            });
          }
        });

        setChats(Array.from(conversationsMap.values()));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chats. Please try again later.",
        });
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}hr ago`;
    return messageDate.toLocaleDateString();
  };

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
        {isLoading ? (
          <div className="text-gray-500 text-center py-4">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No messages yet</div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="flex items-center gap-3 w-full text-left"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar_url} alt={chat.username} />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{chat.username}</span>
                    <span className="text-xs text-gray-500">{chat.last_message_time}</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{chat.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Chats;