import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface ChatPreviewProps {
  id: string;
  content: string;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
  onClick: () => void;
}

export const ChatPreview = ({ content, created_at, profile, onClick }: ChatPreviewProps) => {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage 
          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
          alt={profile.username}
        />
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{profile.username}</h3>
        <p className="text-sm text-gray-400">{content}</p>
      </div>
      <span className="text-xs text-gray-500">
        {new Date(created_at).toLocaleDateString()}
      </span>
    </div>
  );
};