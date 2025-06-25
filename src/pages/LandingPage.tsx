
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Calendar, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Play,
  Smartphone,
  BarChart3
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCategories from "@/components/categories/EventCategories";
import StateFilter from "@/components/filters/StateFilter";
import AuthModal from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Gestão Completa de Eventos",
      description: "Crie, gerencie e promova seus eventos com ferramentas profissionais"
    },
    {
      icon: Smartphone,
      title: "Ingressos Digitais",
      description: "QR Codes únicos e sistema de check-in automático"
    },
    {
      icon: BarChart3,
      title: "Relatórios em Tempo Real",
      description: "Acompanhe vendas, participantes e métricas importantes"
    },
    {
      icon: Shield,
      title: "Pagamentos Seguros",
      description: "Processamento seguro de pagamentos com as melhores taxas"
    },
    {
      icon: Users,
      title: "Gestão de Participantes",
      description: "Controle completo sobre inscrições e participantes"
    },
    {
      icon: Zap,
      title: "Automação Inteligente",
      description: "Automatize confirmações, lembretes e comunicações"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para começar",
      features: [
        "Eventos gratuitos ilimitados",
        "Até 100 participantes por evento",
        "QR Code para check-in",
        "Suporte por email"
      ],
      popular: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Básico",
      price: "R$ 29",
      period: "/mês",
      description: "Para eventos pequenos e médios",
      features: [
        "Eventos pagos e gratuitos",
        "Até 500 participantes por evento",
        "Taxa de 5% sobre vendas",
        "Relatórios básicos",
        "Suporte prioritário"
      ],
      popular: true,
      buttonText: "Assinar Básico"
    },
    {
      name: "Premium",
      price: "R$ 79",
      period: "/mês",
      description: "Para organizadores profissionais",
      features: [
        "Eventos ilimitados",
        "Participantes ilimitados",
        "Taxa de 3% sobre vendas",
        "Relatórios avançados",
        "Suporte 24/7",
        "White label"
      ],
      popular: false,
      buttonText: "Assinar Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAuthClick={() => setAuthModalOpen(true)}
        onCreateEventClick={() => setAuthModalOpen(true)}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            ✨ A revolução dos eventos chegou
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ingrezzi
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma mais completa para criar, gerenciar e vender ingressos para seus eventos. 
            Simples, seguro e profissional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Começar Agora Grátis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-2"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span>4.9/5 estrelas</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-1" />
              <span>+10.000 organizadores</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-green-500 mr-1" />
              <span>+50.000 eventos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <EventCategories />

      {/* State Filter */}
      <StateFilter 
        onStateChange={setSelectedState}
        onCityChange={setSelectedCity}
      />

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tudo que você precisa para seus eventos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para criar experiências inesquecíveis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Planos para todos os tamanhos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 ${plan.popular ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'} hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-800">
                    {plan.price}
                    <span className="text-lg text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para revolucionar seus eventos?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de organizadores que já confiam no Ingrezzi
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
            onClick={() => navigate('/auth')}
          >
            Criar Conta Grátis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default LandingPage;
