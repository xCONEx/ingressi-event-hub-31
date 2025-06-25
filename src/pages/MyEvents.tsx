
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import CreateEventModal from "@/components/events/CreateEventModal";
import { Calendar, MapPin, Users, Eye, Edit, Trash2, Plus, BarChart3 } from "lucide-react";

const MyEvents = () => {
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  // Mock data para demonstração
  const events = [
    {
      id: "1",
      title: "Workshop de React",
      description: "Aprenda React do zero ao avançado",
      date: "2024-07-20",
      time: "14:00",
      location: "São Paulo, SP",
      category: "Tecnologia",
      status: "published",
      ticketType: "free",
      price: 0,
      capacity: 50,
      ticketsSold: 23,
      imageUrl: null
    },
    {
      id: "2",
      title: "Festival de Jazz",
      description: "Uma noite inesquecível com os melhores músicos",
      date: "2024-08-15",
      time: "20:00",
      location: "Rio de Janeiro, RJ",
      category: "Música",
      status: "draft",
      ticketType: "paid",
      price: 80.00,
      capacity: 200,
      ticketsSold: 0,
      imageUrl: null
    }
  ];

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
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                        <span className="text-white text-4xl">🎉</span>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            {event.category}
                          </Badge>
                          {getStatusBadge(event.status)}
                        </div>
                        <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {event.description}
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
                            {event.ticketsSold}/{event.capacity} inscritos
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-purple-600">
                            {event.ticketType === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2)}`}
                          </span>
                          <div className="text-sm text-gray-500">
                            {Math.round((event.ticketsSold / event.capacity) * 100)}% ocupado
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
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="published">
              <div className="text-center py-12">
                <p className="text-gray-500">Eventos publicados aparecerão aqui.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="text-center py-12">
                <p className="text-gray-500">Rascunhos de eventos aparecerão aqui.</p>
              </div>
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
                      <div className="text-2xl font-bold text-blue-600">2</div>
                      <div className="text-sm text-gray-600">Eventos Criados</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">23</div>
                      <div className="text-sm text-gray-600">Ingressos Vendidos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">R$ 0</div>
                      <div className="text-sm text-gray-600">Receita Total</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">46%</div>
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
      />
    </div>
  );
};

export default MyEvents;
