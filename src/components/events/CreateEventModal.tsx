import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateEventModal = ({ open, onOpenChange }: CreateEventModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [canCreatePaid, setCanCreatePaid] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    ticket_type: "free" as "free" | "paid",
    price: "",
    capacity: "",
    image_url: "",
  });

  useEffect(() => {
    if (open) {
      checkUserPlan();
    }
  }, [open]);

  const checkUserPlan = async () => {
    try {
      const storedUser = localStorage.getItem('ingrezzi_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_type, plan_expires_at')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserPlan(profile.plan_type || 'free');
          const planValid = !profile.plan_expires_at || new Date(profile.plan_expires_at) > new Date();
          setCanCreatePaid(profile.plan_type !== 'free' && planValid);
        }
      }
    } catch (error) {
      console.error('Error checking user plan:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificar se usuário pode criar evento pago
      if (formData.ticket_type === 'paid' && !canCreatePaid) {
        toast({
          title: "Upgrade necessário",
          description: "Usuários com plano gratuito só podem criar eventos gratuitos. Faça upgrade do seu plano.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get or create user profile
      let organizerId = null;
      const storedUser = localStorage.getItem('ingrezzi_user');
      
      if (storedUser) {
        organizerId = JSON.parse(storedUser).id;
      } else {
        // Create temporary organizer profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .insert([{
            name: "Organizador Temporário",
            email: "temp@organizador.com",
            is_organizer: true
          }])
          .select()
          .single();

        if (profileError) throw profileError;
        organizerId = profile.id;
        localStorage.setItem('ingrezzi_user', JSON.stringify(profile));
      }

      const eventData = {
        ...formData,
        organizer_id: organizerId,
        price: formData.ticket_type === 'paid' ? parseFloat(formData.price) || 0 : 0,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        status: 'published' as const,
      };

      const { error } = await supabase
        .from("events")
        .insert(eventData);

      if (error) throw error;

      toast({
        title: "Evento criado com sucesso!",
        description: formData.ticket_type === 'paid' 
          ? `Seu evento foi publicado. Taxa do sistema: ${userPlan === 'basic' ? '5%' : '3%'}`
          : "Seu evento gratuito foi publicado e já está disponível.",
      });

      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        ticket_type: "free" as "free" | "paid",
        price: "",
        capacity: "",
        image_url: "",
      });
      window.location.reload();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar evento",
        description: error instanceof Error ? error.message : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Criar Novo Evento
            <Crown className={`w-4 h-4 ${userPlan === 'free' ? 'text-gray-400' : userPlan === 'basic' ? 'text-blue-500' : 'text-purple-500'}`} />
            <span className="text-sm font-normal text-gray-500">
              Plano {userPlan === 'free' ? 'Gratuito' : userPlan === 'basic' ? 'Básico' : 'Premium'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do seu evento
          </DialogDescription>
        </DialogHeader>

        {userPlan === 'free' && (
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              Com o plano gratuito, você pode criar apenas eventos gratuitos. 
              Faça upgrade para criar eventos pagos e ter acesso a mais recursos.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do evento *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Nome do seu evento"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva seu evento..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <Input
              id="location"
              name="location"
              placeholder="Endereço ou local do evento"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Música">Música</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Negócios">Negócios</SelectItem>
                  <SelectItem value="Esportes">Esportes</SelectItem>
                  <SelectItem value="Arte">Arte</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="Número de participantes"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de ingresso *</Label>
            <Select onValueChange={(value) => handleSelectChange("ticket_type", value)} defaultValue="free">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="paid" disabled={!canCreatePaid}>
                  Pago {!canCreatePaid && "(Upgrade necessário)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.ticket_type === "paid" && canCreatePaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">
                Taxa do sistema: {userPlan === 'basic' ? '5%' : '3%'} sobre cada venda
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
