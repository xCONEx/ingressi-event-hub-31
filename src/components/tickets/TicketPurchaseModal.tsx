
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface TicketPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
}

const TicketPurchaseModal = ({ open, onOpenChange, event }: TicketPurchaseModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    attendee_name: "",
    attendee_email: "",
    attendee_phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .insert([{
          event_id: event.id,
          attendee_name: formData.attendee_name,
          attendee_email: formData.attendee_email,
          attendee_phone: formData.attendee_phone,
          price: event.price || 0,
          payment_status: event.ticket_type === 'free' ? 'completed' : 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ingresso confirmado!",
        description: `Seu ingresso foi gerado com o código: ${ticket.qr_code}`,
      });

      // Reset form and close modal
      setFormData({
        attendee_name: "",
        attendee_email: "",
        attendee_phone: "",
      });
      onOpenChange(false);

      // Show ticket details
      setTimeout(() => {
        toast({
          title: "Ingresso salvo!",
          description: "Verifique seu email para ver o QR Code do ingresso.",
        });
      }, 1000);

    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Erro ao gerar ingresso",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Garantir Ingresso</DialogTitle>
          <DialogDescription>
            Preencha seus dados para garantir seu ingresso para {event.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attendee_name">Nome completo *</Label>
            <Input
              id="attendee_name"
              name="attendee_name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.attendee_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendee_email">E-mail *</Label>
            <Input
              id="attendee_email"
              name="attendee_email"
              type="email"
              placeholder="seu@email.com"
              value={formData.attendee_email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendee_phone">Telefone</Label>
            <Input
              id="attendee_phone"
              name="attendee_phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.attendee_phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Resumo do Ingresso</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Evento:</strong> {event.title}</p>
              <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</p>
              <p><strong>Local:</strong> {event.location}</p>
              <p><strong>Preço:</strong> {event.ticket_type === 'free' ? 'Gratuito' : `R$ ${event.price?.toFixed(2)}`}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processando..." : "Confirmar Ingresso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketPurchaseModal;
