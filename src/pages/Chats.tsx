import { ChatPreview } from "@/components/chat/ChatPreview";
import { EmptyChats } from "@/components/chat/EmptyChats";
import { useChats } from "@/hooks/useChats";

const Chats = () => {
  const { chats, loading } = useChats();

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
        <EmptyChats />
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <ChatPreview
              key={chat.id}
              profile={chat.profile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;