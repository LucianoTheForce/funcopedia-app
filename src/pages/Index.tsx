import { Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  online: boolean;
  is_fake: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState<Profile[]>([]);
  const [freshFaces, setFreshFaces] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      // Split profiles into fresh faces (newest 6) and nearby users (rest)
      if (profiles) {
        setFreshFaces(profiles.slice(0, 6));
        setNearbyUsers(profiles.slice(6));
      }
    };

    fetchProfiles();
  }, []);
  
  const handleUserClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  // Function to determine text color based on user type
  const getUserTextColor = (isFake: boolean) => {
    return isFake ? 'text-gray-400' : 'text-white';
  };

  // Function to determine background color based on user type
  const getUserBackgroundColor = (isFake: boolean) => {
    return isFake ? 'bg-gray-700' : 'bg-gradient-to-r from-primary to-orange-400';
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Eye className="text-white" size={24} />
          <span className="text-white">{nearbyUsers.length + freshFaces.length} Users</span>
          <button className="text-primary ml-2">See All</button>
        </div>
      </header>
      
      <main className="px-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Fresh Faces</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {freshFaces.map((user) => (
              <div 
                key={user.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <Avatar className={`w-16 h-16 ring-2 ${user.is_fake ? 'ring-gray-600' : 'ring-primary'}`}>
                  <AvatarImage src={user.avatar_url} alt={user.username} className="object-cover" />
                </Avatar>
                <span className={`text-sm mt-2 ${getUserTextColor(user.is_fake)}`}>
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Who's Nearby</h2>
          <div className="grid grid-cols-3 gap-3">
            {nearbyUsers.map((user) => (
              <div 
                key={user.id} 
                className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <img 
                  src={user.avatar_url} 
                  alt={user.username} 
                  className={`w-full h-full object-cover ${user.is_fake ? 'filter grayscale' : ''}`} 
                />
                <div className={`absolute bottom-0 left-0 right-0 p-2 ${getUserBackgroundColor(user.is_fake)}`}>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-white text-sm">{user.username}</span>
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
      </main>

      <Navigation />
    </div>
  );
};

export default Index;