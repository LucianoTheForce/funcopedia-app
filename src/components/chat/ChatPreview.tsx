import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface ChatPreviewProps {
  profile: Profile;
}

export const ChatPreview = ({ profile }: ChatPreviewProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!profile?.username) {
      console.error('No username available for navigation');
      return;
    }
    navigate(`/chat/${profile.username}`, { replace: true });
  };

  return (
    <Button
      variant="ghost"
      className="w-full flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors"
      onClick={handleClick}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
          alt={profile.username || 'User avatar'}
        />
      </Avatar>
      <div className="flex-1 text-left">
        <h3 className="font-medium text-white">{profile.username || 'Anonymous'}</h3>
        <p className="text-sm text-gray-400">Click to chat</p>
      </div>
    </Button>
  );
};