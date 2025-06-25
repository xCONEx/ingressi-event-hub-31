
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Smartphone, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Crie sua conta",
      description: "Cadastre-se gratuitamente no Ingrezzi em poucos cliques",
      icon: Users,
      color: "from-purple-500 to-blue-500"
    },
    {
      number: "2", 
      title: "Configure seu evento",
      description: "Adicione detalhes, data, local e tipo de ingresso",
      icon: Calendar,
      color: "from-blue-500 to-indigo-500"
    },
    {
      number: "3",
      title: "Publique e divulgue",
      description: "Seu evento fica disponível para venda de ingressos",
      icon: Smartphone,
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "4",
      title: "Gerencie tudo",
      description: "Acompanhe vendas e faça check-in dos participantes",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const features = [
    "Ingressos digitais com QR Code único",
    "Sistema de check-in automático",
    "Dashboard com relatórios em tempo real",
    "Gestão completa de participantes",
    "Eventos gratuitos e pagos",
    "Suporte especializado"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAuthClick={() => navigate("/auth")}
        onCreateEventClick={() => navigate("/auth")}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Como Funciona o Ingrezzi
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra como é simples criar, gerenciar e vender ingressos para seus eventos
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-4 relative`}>
                      <IconComponent className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-purple-600 font-bold text-sm">{step.number}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Tudo que você precisa em uma plataforma
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita agora e organize seu primeiro evento
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
            onClick={() => navigate("/auth")}
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
