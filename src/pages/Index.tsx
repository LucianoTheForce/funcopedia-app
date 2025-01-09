import { Eye, Star } from "lucide-react";
import Navigation from "../components/Navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const freshFaces = [
    { id: 1, name: "Thomas", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png" },
    { id: 2, name: "Jamie", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png" },
    { id: 3, name: "Connor", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png" },
    { id: 4, name: "Benjamin", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png" },
  ];

  const nearbyUsers = [
    { id: 1, name: "Brodi", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 2, name: "Ben", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 3, name: "John", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 4, name: "Thomas", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 5, name: "Seraph", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 6, name: "Johnathan", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 7, name: "Martin", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 8, name: "Ezikiel", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
    { id: 9, name: "Daniel", image: "/lovable-uploads/ad4947e3-f150-4059-b979-7e600e1d71c6.png", online: true },
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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