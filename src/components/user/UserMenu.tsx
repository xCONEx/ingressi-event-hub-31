
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  CreditCard, 
  Calendar, 
  LogOut, 
  X 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface UserMenuProps {
  onClose?: () => void;
}

const UserMenu = ({ onClose }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Mobile/Tablet Menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 bg-white z-50 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="mb-8">
            <p className="text-xl text-gray-800">Olá, {user.name || user.email?.split('@')[0]}</p>
          </div>
          
          <nav className="space-y-6">
            <Button variant="ghost" className="w-full justify-start text-lg p-4 h-auto" onClick={handleClose}>
              <User className="mr-4 h-6 w-6 text-purple-600" />
              Meus dados
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-lg p-4 h-auto" onClick={handleClose}>
              <CreditCard className="mr-4 h-6 w-6 text-purple-600" />
              Minhas compras
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-lg p-4 h-auto" onClick={handleClose}>
              <Calendar className="mr-4 h-6 w-6 text-purple-600" />
              Meus eventos
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-lg p-4 h-auto" 
              onClick={() => {
                logout();
                handleClose();
              }}
            >
              <LogOut className="mr-4 h-6 w-6 text-purple-600" />
              Sair
            </Button>
          </nav>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🎧</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Suporte</h3>
                <p className="text-gray-600 text-sm">
                  Entre em contato com nosso suporte e tire suas dúvidas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg text-white">
            <h3 className="font-semibold text-lg mb-2">Seu evento na Tiketo</h3>
            <p className="text-sm mb-4 text-orange-100">
              Publicar seu evento na Tiketo é fácil e rápido! Vamos lá?
            </p>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleClose}
            >
              Publicar evento
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:block">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Meus dados</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Minhas compras</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
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
    </>
  );
};

export default UserMenu;
