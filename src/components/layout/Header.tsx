
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, BarChart3, Plus, CreditCard, Calendar, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserMenu from "@/components/user/UserMenu";

interface HeaderProps {
  onAuthClick: () => void;
  onCreateEventClick: () => void;
}

const Header = ({ onAuthClick, onCreateEventClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation("/")}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ingrezzi
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-purple-600"
            onClick={() => handleNavigation("/events")}
          >
            Eventos
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
            Como Funciona
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
            Suporte
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                onClick={onCreateEventClick}
                className="hidden md:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
              
              {/* Desktop Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meus dados</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/purchases")}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Minhas compras</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/my-events")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Meus eventos</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {/* Mobile Menu */}
              {showMobileMenu && (
                <UserMenu onClose={() => setShowMobileMenu(false)} />
              )}
            </>
          ) : (
            <Button 
              onClick={() => handleNavigation("/auth")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
