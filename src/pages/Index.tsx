
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, MapPin, Users, Ticket, Plus, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AuthModal from "@/components/auth/AuthModal";
import CreateEventModal from "@/components/events/CreateEventModal";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set category from URL params
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    if (categoria) {
      setSelectedCategory(categoria);
    }
  }, [searchParams]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: ticketCounts = {} } = useQuery({
    queryKey: ['ticket-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('event_id');

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(ticket => {
        counts[ticket.event_id] = (counts[ticket.event_id] || 0) + 1;
      });

      return counts;
    },
  });

  const categories = [
    "Conferências e Seminários",
    "Congressos e Palestras", 
    "Retiros Espirituais",
    "Cursos e Workshops",
    "Reuniões e Encontros",
    "Festas e Shows",
    "Espetáculos e Teatros",
    "Eventos Online",
    "Eventos Drive-in",
    "Eventos Gratuitos",
    "Eventos Solidários",
    "Eventos Diversos"
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      event.category === selectedCategory ||
      (!event.category && selectedCategory === "Eventos Diversos");

    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header 
          onAuthClick={() => setAuthModalOpen(true)}
          onCreateEventClick={() => setCreateEventModalOpen(true)}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/checkin')}
            >
              <Ticket className="w-5 h-5 mr-2" />
              Check-in
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto mb-12 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar eventos por nome, categoria ou cidade..."
                className="pl-12 py-6 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCategory && (
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCategory("")}
                  className="shrink-0"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {selectedCategory ? `Eventos: ${selectedCategory}` : "Eventos em Destaque"}
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">
                {events.length === 0 ? "Nenhum evento encontrado" : "Nenhum evento corresponde à sua busca"}
              </p>
              <Button 
                onClick={() => setCreateEventModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {event.category || "Evento"}
                      </Badge>
                      <span className="font-bold text-lg text-purple-600">
                        {event.ticket_type === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2)}`}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {event.description || "Evento incrível que você não pode perder!"}
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
                        {ticketCounts[event.id] || 0} participantes
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
