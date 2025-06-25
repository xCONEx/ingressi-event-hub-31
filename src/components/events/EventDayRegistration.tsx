
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EventDayRegistrationProps {
  eventId: string;
  ticketId: string;
  onRegistrationComplete: () => void;
}

const EventDayRegistration = ({ eventId, ticketId, onRegistrationComplete }: EventDayRegistrationProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: eventDays = [], isLoading } = useQuery({
    queryKey: ['event-days', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_days')
        .select('*')
        .eq('event_id', eventId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: existingRegistrations = [] } = useQuery({
    queryKey: ['event-day-registrations', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_day_registrations')
        .select('event_day_id')
        .eq('ticket_id', ticketId);

      if (error) throw error;
      return data?.map(reg => reg.event_day_id) || [];
    },
  });

  const registerForDays = useMutation({
    mutationFn: async (dayIds: string[]) => {
      // Remove existing registrations
      if (existingRegistrations.length > 0) {
        const { error: deleteError } = await supabase
          .from('event_day_registrations')
          .delete()
          .eq('ticket_id', ticketId);

        if (deleteError) throw deleteError;
      }

      // Add new registrations
      if (dayIds.length > 0) {
        const registrations = dayIds.map(dayId => ({
          event_day_id: dayId,
          ticket_id: ticketId
        }));

        const { error: insertError } = await supabase
          .from('event_day_registrations')
          .insert(registrations);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Inscrição atualizada!",
        description: "Sua inscrição nos dias do evento foi atualizada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['event-day-registrations', ticketId] });
      onRegistrationComplete();
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível atualizar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDayToggle = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = () => {
    registerForDays.mutate(selectedDays);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (eventDays.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Este evento não possui dias específicos configurados.</p>
        </CardContent>
      </Card>
    );
  }

  // Initialize selected days with existing registrations
  useState(() => {
    if (existingRegistrations.length > 0 && selectedDays.length === 0) {
      setSelectedDays(existingRegistrations);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Selecione os dias que você participará
        </CardTitle>
        <CardDescription>
          Este evento acontece em múltiplos dias. Selecione os dias que você deseja participar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventDays.map((day) => (
          <div
            key={day.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedDays.includes(day.id) 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleDayToggle(day.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedDays.includes(day.id)}
                  onChange={() => handleDayToggle(day.id)}
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      {new Date(day.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {day.capacity && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Capacidade: {day.capacity} pessoas</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {day.price > 0 ? (
                  <Badge variant="secondary">
                    R$ {day.price.toFixed(2)}
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Gratuito
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedDays.length} de {eventDays.length} dias selecionados
          </div>
          <Button
            onClick={handleSubmit}
            disabled={registerForDays.isPending}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {registerForDays.isPending ? "Salvando..." : "Salvar Inscrição"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDayRegistration;
