
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import CreateEventModal from "@/components/events/CreateEventModal";
import { Calendar, MapPin, Users, Eye, Edit, Trash2, Plus, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  category?: string;
  status: string;
  ticket_type: string;
  price?: number;
  capacity?: number;
  image_url?: string;
  tickets_sold?: number;
}

const MyEvents = () => {
  const { user } = useAuth();
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    averageOccupancy: 0
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchAnalytics();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          tickets!inner(id)
        `)
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const eventsWithTicketCount = eventsData?.map(event => ({
        ...event,
        tickets_sold: event.tickets?.length || 0
      })) || [];

      setEvents(eventsWithTicketCount);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar seus eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, capacity, price, ticket_type')
        .eq('organizer_id', user?.id);

      if (eventsError) throw eventsError;

      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('price, event_id')
        .in('event_id', eventsData?.map(e => e.id) || []);

      if (ticketsError) throw ticketsError;

      const totalEvents = eventsData?.length || 0;
      const totalTicketsSold = ticketsData?.length || 0;
      const totalRevenue = ticketsData?.reduce((sum, ticket) => sum + (ticket.price || 0), 0) || 0;
      
      let totalCapacity = 0;
      let averageOccupancy = 0;
      
      if (eventsData && eventsData.length > 0) {
        totalCapacity = eventsData.reduce((sum, event) => sum + (event.capacity || 0), 0);
        averageOccupancy = totalCapacity > 0 ? (totalTicketsSold / totalCapacity) * 100 : 0;
      }

      setAnalytics({
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        averageOccupancy: Math.round(averageOccupancy)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Rascunho</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });

      fetchEvents();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
    }
  };

  const filterEventsByStatus = (status?: string) => {
    if (!status || status === 'all') return events;
    return events.filter(event => event.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={() => {}} onCreateEventClick={() => setCreateEventModalOpen(true)} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Meus Eventos</h1>
            <div className="text-center py-8">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-4xl">🎉</span>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            {event.category || 'Geral'}
          </Badge>
          {getStatusBadge(event.status)}
        </div>
        <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {event.description || 'Sem descrição'}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {event.tickets_sold || 0}/{event.capacity || 0} inscritos
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-purple-600">
            {event.ticket_type === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2) || '0.00'}`}
          </span>
          <div className="text-sm text-gray-500">
            {event.capacity ? Math.round(((event.tickets_sold || 0) / event.capacity) * 100) : 0}% ocupado
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={() => {}}
        onCreateEventClick={() => setCreateEventModalOpen(true)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Meus Eventos</h1>
            <Button 
              onClick={() => setCreateEventModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="published">Publicados</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">Você ainda não criou nenhum evento.</p>
                    <Button 
                      onClick={() => setCreateEventModalOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Evento
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="published">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterEventsByStatus('published').map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {filterEventsByStatus('published').length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum evento publicado encontrado.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterEventsByStatus('draft').map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {filterEventsByStatus('draft').length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum rascunho encontrado.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analytics dos Eventos
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o desempenho dos seus eventos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analytics.totalEvents}</div>
                      <div className="text-sm text-gray-600">Eventos Criados</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analytics.totalTicketsSold}</div>
                      <div className="text-sm text-gray-600">Ingressos Vendidos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">R$ {analytics.totalRevenue.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Receita Total</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analytics.averageOccupancy}%</div>
                      <div className="text-sm text-gray-600">Taxa de Ocupação</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CreateEventModal 
        open={createEventModalOpen} 
        onOpenChange={setCreateEventModalOpen}
        onEventCreated={() => {
          fetchEvents();
          fetchAnalytics();
        }}
      />
    </div>
  );
};

export default MyEvents;
