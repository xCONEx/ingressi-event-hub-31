
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import TicketPurchaseModal from "@/components/tickets/TicketPurchaseModal";
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
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
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: ticketCount = 0 } = useQuery({
    queryKey: ['ticket-count', id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact' })
        .eq('event_id', id);

      if (error) throw error;
      return count || 0;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header onAuthClick={() => {}} onCreateEventClick={() => {}} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header onAuthClick={() => {}} onCreateEventClick={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Evento não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar para home</Button>
        </div>
      </div>
    );
  }

  const isCapacityFull = event.capacity && ticketCount >= event.capacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header onAuthClick={() => {}} onCreateEventClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Image and Info */}
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-2xl mb-6">
              <img 
                src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {event.category || "Evento"}
                  </Badge>
                  <span className="text-2xl font-bold text-purple-600">
                    {event.ticket_type === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2)}`}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {event.description || "Evento incrível que você não pode perder!"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-semibold">Data</p>
                    <p>{new Date(event.date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-semibold">Horário</p>
                    <p>{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-semibold">Local</p>
                    <p>{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="font-semibold">Participantes</p>
                    <p>{ticketCount} {event.capacity ? `/ ${event.capacity}` : ''}</p>
                  </div>
                </div>
              </div>

              {event.profiles && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Organizador</h3>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-purple-600" />
                    <span>{event.profiles.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Garantir Ingresso</CardTitle>
                <CardDescription>
                  {isCapacityFull ? "Evento lotado" : "Confirme sua presença"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {event.ticket_type === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2)}`}
                  </div>
                  {event.capacity && (
                    <p className="text-sm text-gray-600">
                      {event.capacity - ticketCount} vagas restantes
                    </p>
                  )}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => setTicketModalOpen(true)}
                  disabled={isCapacityFull}
                >
                  {isCapacityFull ? "Evento Lotado" : "Garantir Ingresso"}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>✓ Ingresso digital com QR Code</p>
                  <p>✓ Confirmação por email</p>
                  {event.ticket_type === 'free' && <p>✓ Entrada gratuita</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <TicketPurchaseModal 
        open={ticketModalOpen}
        onOpenChange={setTicketModalOpen}
        event={event}
      />
    </div>
  );
};

export default EventDetail;
