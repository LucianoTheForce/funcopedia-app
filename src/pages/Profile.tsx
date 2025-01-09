import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);

      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If no profile exists, create one
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              username: user.email?.split('@')[0] || '',
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      }

      setProfile(profile);
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
    } catch (error: any) {
      console.error("Error loading user:", error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setEditing(false);
      getProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "Please try again later.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again later.",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={updateProfile} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Email</Label>
                <p className="text-white mt-1">{user?.email}</p>
              </div>

              <div>
                <Label className="text-gray-400">Username</Label>
                <p className="text-white mt-1">{username || "Not set"}</p>
              </div>

              <Button 
                variant="secondary" 
                onClick={() => setEditing(true)}
                className="w-full flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Profile
              </Button>

              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;