
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users, Ticket, Plus } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import CreateEventModal from "@/components/events/CreateEventModal";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading } = useAuth();

  // Mock events data - will be replaced with real data later
  const mockEvents = [
    {
      id: 1,
      title: "Festival de Música Eletrônica",
      description: "Uma noite inesquecível com os melhores DJs do Brasil",
      date: "2024-07-15",
      time: "20:00",
      location: "São Paulo, SP",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
      price: "R$ 80,00",
      category: "Música",
      attendees: 245
    },
    {
      id: 2,
      title: "Workshop de Empreendedorismo",
      description: "Aprenda as melhores estratégias para começar seu negócio",
      date: "2024-07-20",
      time: "14:00",
      location: "Rio de Janeiro, RJ",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400",
      price: "Gratuito",
      category: "Negócios",
      attendees: 89
    },
    {
      id: 3,
      title: "Encontro de Tecnologia",
      description: "Palestras sobre as últimas tendências em tecnologia",
      date: "2024-07-25",
      time: "09:00",
      location: "Belo Horizonte, MG",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400",
      price: "R$ 50,00",
      category: "Tecnologia",
      attendees: 156
    }
  ];

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header 
        onAuthClick={() => setAuthModalOpen(true)}
        onCreateEventClick={() => setCreateEventModalOpen(true)}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ingrezzi
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A plataforma completa para criar, gerenciar e vender ingressos para seus eventos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setCreateEventModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Evento
            </Button>
            <Button size="lg" variant="outline">
              <Ticket className="w-5 h-5 mr-2" />
              Comprar Ingressos
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar eventos por nome, categoria ou cidade..."
              className="pl-12 py-6 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Eventos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      {event.category}
                    </Badge>
                    <span className="font-bold text-lg text-purple-600">{event.price}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-600">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} participantes
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Por que escolher o Ingrezzi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ingressos Digitais</h3>
              <p className="text-gray-600">QR Codes únicos para cada ingresso com sistema de check-in integrado</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
              <p className="text-gray-600">Dashboard intuitivo para acompanhar vendas e gerenciar participantes</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-gray-600">Interface moderna e intuitiva para criar eventos em poucos cliques</p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <CreateEventModal open={createEventModalOpen} onOpenChange={setCreateEventModalOpen} />
    </div>
  );
};

export default Index;
