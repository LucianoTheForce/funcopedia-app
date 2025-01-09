import { Star } from "lucide-react";
import { calculateDistance, formatDistance } from "@/utils/distance";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Profile = Tables<"profiles">;

interface NearbyUsersProps {
  users: Profile[];
  currentUser: Profile | null;
  onUserClick: (userId: string) => void;
  getUserBackgroundColor: (isFake: boolean | null) => string;
}

const NearbyUsers = ({ users, currentUser, onUserClick, getUserBackgroundColor }: NearbyUsersProps) => {
  const navigate = useNavigate();

  const handleUserClick = (user: Profile) => {
    if (!user.username) {
      console.error('No username available for navigation');
      return;
    }
    navigate(`/chat/${user.username}`);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">Who's Nearby</h2>
      <div className="grid grid-cols-3 gap-3">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            <img 
              src={user.avatar_url || ''} 
              alt={user.username || ''} 
              className={`w-full h-full object-cover ${user.is_fake ? 'grayscale' : ''}`} 
            />
            <div className={`absolute bottom-0 left-0 right-0 p-2 ${getUserBackgroundColor(user.is_fake)}`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-white text-sm">
                    {user.id === currentUser?.id ? `${user.username} (You)` : user.username}
                  </span>
                </div>
                {currentUser && user.id !== currentUser.id && (
                  <span className="text-xs text-white/80">
                    {formatDistance(calculateDistance(
                      currentUser.latitude,
                      currentUser.longitude,
                      user.latitude,
                      user.longitude
                    ))}
                  </span>
                )}
              </div>
            </div>
            <button 
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
              }}
            >
              <Star size={16} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbyUsers;