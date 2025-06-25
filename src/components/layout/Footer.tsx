
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Facebook, Youtube, Mail, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Precisando de uma ajudinha da Ingrezzi?</h2>
          </div>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            onClick={() => handleNavigation('/support')}
          >
            🎧 Acessar Central de Ajuda
          </Button>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">I</span>
              </div>
              <span className="text-2xl font-bold text-white">ingrezzi</span>
            </div>
          </div>

          {/* Institucional */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/content/quanto-custa')}
                >
                  Quanto Custa?
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/content/termos-de-uso')}
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/content/politica-privacidade')}
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/events?categoria=conferencias-seminarios')}
                >
                  Conferências e Seminários
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/events?categoria=congressos-palestras')}
                >
                  Congressos e Palestras
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/events?categoria=retiros-espirituais')}
                >
                  Retiros Espirituais
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/events?categoria=cursos-workshops')}
                >
                  Cursos e Workshops
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors"
                  onClick={() => handleNavigation('/events?categoria=reunioes-encontros')}
                >
                  Reuniões e Encontros
                </button>
              </li>
              <li>
                <button 
                  className="text-purple-100 hover:text-white transition-colors flex items-center"
                  onClick={() => handleNavigation('/events')}
                >
                  Ver todas →
                </button>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
            <div className="flex space-x-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-purple-200 hover:bg-purple-700"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-purple-200 hover:bg-purple-700"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-purple-200 hover:bg-purple-700"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-purple-200 hover:bg-purple-700"
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm text-purple-100">contato@ingrezzi.com.br</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <div>
                  <p className="text-sm font-semibold">Whatsapp</p>
                  <p className="text-sm text-purple-100">Apenas mensagens:</p>
                  <p className="text-sm text-purple-100">+55 (27) 99755-7004</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-400 pt-8">
          <div className="text-center text-purple-100">
            <p>&copy; 2024 Ingrezzi. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
