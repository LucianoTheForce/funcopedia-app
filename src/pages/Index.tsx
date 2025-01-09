import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import FreshFaces from "@/components/home/FreshFaces";
import NearbyUsers from "@/components/home/NearbyUsers";

type Profile = Tables<"profiles">;

interface Coordinates {
  latitude: number;
  longitude: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nearbyUsers, setNearbyUsers] = useState<Profile[]>([]);
  const [freshFaces, setFreshFaces] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            .eq('id', user.id);
        }
      } catch (error) {
        toast({
          title: "Localização",
          description: "Por favor, permita o acesso à sua localização para ver usuários próximos.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (currentUserProfile) {
        setCurrentUser(currentUserProfile);
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) {
        const otherProfiles = profiles.filter(profile => profile.id !== user.id);
        setFreshFaces(otherProfiles.slice(0, 6));
        const nearbyUsersArray = currentUserProfile 
          ? [currentUserProfile, ...otherProfiles.slice(6)]
          : otherProfiles.slice(6);
        setNearbyUsers(nearbyUsersArray);
      }
    };

    fetchProfiles();
    requestLocationPermission();
  }, [navigate]);
  
  const handleUserClick = (username: string) => {
    navigate(`/chat/${username}`); // Updated to navigate directly to chat
  };

  const getUserTextColor = (isFake: boolean | null) => {
    return isFake ? 'text-gray-400' : 'text-white';
  };

  const getUserBackgroundColor = (isFake: boolean | null) => {
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
        <FreshFaces 
          users={freshFaces}
          currentUser={currentUser}
          onUserClick={handleUserClick}
          getUserTextColor={getUserTextColor}
        />

        <NearbyUsers 
          users={nearbyUsers}
          currentUser={currentUser}
          onUserClick={handleUserClick}
          getUserBackgroundColor={getUserBackgroundColor}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default Index;