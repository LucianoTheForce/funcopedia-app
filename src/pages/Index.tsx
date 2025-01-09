import { Eye, Star } from "lucide-react";
import Navigation from "../components/Navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const freshFaces = [
    { id: 1, name: "Sofia", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" },
    { id: 2, name: "Lucas", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
    { id: 3, name: "Isabella", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella" },
    { id: 4, name: "Miguel", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel" },
    { id: 5, name: "Valentina", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina" },
    { id: 6, name: "João", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" },
  ];

  const nearbyUsers = [
    { id: 1, name: "Maria", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901", online: true },
    { id: 2, name: "Pedro", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", online: true },
    { id: 3, name: "Ana", image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1", online: false },
    { id: 4, name: "Gabriel", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel", online: true },
    { id: 5, name: "Julia", image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2", online: false },
    { id: 6, name: "Rafael", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael", online: true },
    { id: 7, name: "Beatriz", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz", online: true },
    { id: 8, name: "Thiago", image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac", online: false },
    { id: 9, name: "Laura", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura", online: true },
    { id: 10, name: "Bruno", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno", online: true },
    { id: 11, name: "Carolina", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carolina", online: false },
    { id: 12, name: "Diego", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego", online: true },
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Eye className="text-white" size={24} />
          <span className="text-white">146 Viewers</span>
          <button className="text-primary ml-2">See All</button>
        </div>
      </header>
      
      <main className="px-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Fresh Faces</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {freshFaces.map((user) => (
              <div key={user.id} className="flex flex-col items-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                </Avatar>
                <span className="text-sm text-gray-400 mt-2">{user.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Who's Nearby</h2>
          <div className="grid grid-cols-3 gap-3">
            {nearbyUsers.map((user) => (
              <div key={user.id} className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-white text-sm">{user.name}</span>
                  </div>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
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