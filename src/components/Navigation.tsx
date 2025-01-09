import { ShoppingBag, Star, Home, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg p-2">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6">
        <Link to="/store" className="flex flex-col items-center">
          <ShoppingBag size={24} className={`${isActive('/store') ? 'text-primary' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 text-gray-500">Store</span>
        </Link>
        <Link to="/favourites" className="flex flex-col items-center">
          <Star size={24} className={`${isActive('/favourites') ? 'text-primary' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 text-gray-500">Favourites</span>
        </Link>
        <Link to="/" className="flex flex-col items-center">
          <Home size={24} className={`${isActive('/') ? 'text-primary' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 text-gray-500">Home</span>
        </Link>
        <Link to="/chats" className="flex flex-col items-center">
          <MessageSquare size={24} className={`${isActive('/chats') ? 'text-primary' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 text-gray-500">Chats</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center">
          <User size={24} className={`${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 text-gray-500">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;