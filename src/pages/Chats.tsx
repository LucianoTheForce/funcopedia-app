import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ChatPreview {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            profiles!messages_sender_profile_fkey (
              username,
              avatar_url
            )
          `)
          .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const processedChats = data.map(chat => ({
            ...chat,
            profile: chat.profiles
          }));
          setChats(processedChats);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: "Error",
          description: "Failed to load chats",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-white">Messages</h1>
        <div className="text-white">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Messages</h1>
      {chats.length === 0 ? (
        <div className="text-white text-center py-8">
          No messages yet. Start a conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => navigate(`/chat/${chat.profile.username}`)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage 
                  src={chat.profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.profile.username}`} 
                  alt={chat.profile.username}
                />
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{chat.profile.username}</h3>
                <p className="text-sm text-gray-400">{chat.content}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(chat.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;