import { Heart } from "lucide-react";
import Navigation from "../components/Navigation";

const Index = () => {
  const nearbyUsers = [
    { id: 1, name: "Sarah", age: 28, distance: "2km away", image: "/lovable-uploads/9bda5779-9a1a-40b6-959c-19f5e4748ce8.png" },
    { id: 2, name: "Mike", age: 32, distance: "5km away", image: "/lovable-uploads/9bda5779-9a1a-40b6-959c-19f5e4748ce8.png" },
    { id: 3, name: "Jessica", age: 26, distance: "3km away", image: "/lovable-uploads/9bda5779-9a1a-40b6-959c-19f5e4748ce8.png" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 bg-secondary">
        <h1 className="text-2xl font-bold text-center">Discover</h1>
      </header>
      
      <main className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {nearbyUsers.map((user) => (
            <div key={user.id} className="bg-card rounded-xl overflow-hidden animate-fade-in">
              <div className="relative aspect-[3/4]">
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-semibold">{user.name}, {user.age}</h3>
                  <p className="text-sm text-gray-300">{user.distance}</p>
                </div>
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-primary transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Index;