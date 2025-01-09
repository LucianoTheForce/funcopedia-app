import { Home, MessageSquare, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-muted p-2 px-6">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <Link to="/" className={`p-3 rounded-lg transition-colors ${isActive('/') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}>
          <Home size={24} />
        </Link>
        <Link to="/search" className={`p-3 rounded-lg transition-colors ${isActive('/search') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}>
          <Search size={24} />
        </Link>
        <Link to="/messages" className={`p-3 rounded-lg transition-colors ${isActive('/messages') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}>
          <MessageSquare size={24} />
        </Link>
        <Link to="/profile" className={`p-3 rounded-lg transition-colors ${isActive('/profile') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}>
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;