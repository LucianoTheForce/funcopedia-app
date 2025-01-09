import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { calculateDistance, formatDistance } from "@/utils/distance";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface FreshFacesProps {
  users: Profile[];
  currentUser: Profile | null;
  onUserClick: (userId: string) => void;
  getUserTextColor: (isFake: boolean | null) => string;
}

const FreshFaces = ({ users, currentUser, onUserClick, getUserTextColor }: FreshFacesProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Fresh Faces</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onUserClick(user.id)}
          >
            <Avatar className={`w-16 h-16 ring-2 ${user.is_fake ? 'ring-gray-600' : 'ring-primary'}`}>
              <AvatarImage src={user.avatar_url || ''} alt={user.username || ''} className={`object-cover ${user.is_fake ? 'grayscale' : ''}`} />
            </Avatar>
            <span className={`text-sm mt-2 ${getUserTextColor(user.is_fake)}`}>
              {user.username}
            </span>
            {currentUser && (
              <span className="text-xs text-gray-400">
                {formatDistance(calculateDistance(
                  currentUser.latitude,
                  currentUser.longitude,
                  user.latitude,
                  user.longitude
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreshFaces;