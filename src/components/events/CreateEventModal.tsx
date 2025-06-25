
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import CompleteProfileModal from "@/components/profile/CompleteProfileModal";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, Clock } from "lucide-react";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
}

const CreateEventModal = ({ open, onOpenChange, onEventCreated }: CreateEventModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    secondary_category: "",
    location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    visibility: "public" as "public" | "private" | "hidden",
    ticket_type: "free" as "free" | "paid",
    price: "",
    capacity: "",
    image_url: "",
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

  useEffect(() => {
    if (open && user && !user.complete_profile) {
      setShowCompleteProfile(true);
      onOpenChange(false);
    }
  }, [open, user]);

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

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: event, error } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.start_date,
          time: formData.start_time,
          end_date: formData.end_date || formData.start_date,
          end_time: formData.end_time || formData.start_time,
          location: formData.location,
          category: formData.category,
          ticket_type: formData.ticket_type,
          price: formData.ticket_type === 'paid' ? Number(formData.price) : 0,
          capacity: Number(formData.capacity),
          organizer_id: user?.id,
          status: formData.visibility === 'public' ? 'published' : 'draft',
          image_url: formData.image_url
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Evento criado com sucesso!",
        description: `O evento "${formData.title}" foi ${formData.visibility === 'public' ? 'publicado' : 'salvo como rascunho'}.`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        secondary_category: "",
        location: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        visibility: "public",
        ticket_type: "free",
        price: "",
        capacity: "",
        image_url: "",
      });
      setCurrentStep(1);

      onOpenChange(false);
      onEventCreated?.();

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

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep 
                ? 'bg-purple-600 text-white' 
                : step < currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && <div className={`w-16 h-0.5 ${step < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Detalhes do evento</h3>
      <p className="text-gray-600">Conte-nos sobre o seu evento</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Nome do evento *</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria do seu evento *</Label>
            <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_category">Categoria secundária (opcional)</Label>
            <Select onValueChange={(value) => handleSelectChange("secondary_category", value)} value={formData.secondary_category}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria adicional" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Onde irá acontecer? *</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Banner do seu evento</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Clique no botão abaixo ou arraste a imagem aqui dentro.</p>
            <Button type="button" variant="outline">
              Selecionar imagem
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              A imagem deve ter 1920 x 1260. Aceitamos JPEG ou PNG de no máximo 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Quando irá acontecer?</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Data de início *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Horário de início *</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="start_time"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Data final do evento</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">Horário de encerramento</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Opções de visibilidade</Label>
        <div className="space-y-3">
          <div className={`p-4 rounded-lg border cursor-pointer ${formData.visibility === 'public' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
               onClick={() => handleSelectChange('visibility', 'public')}>
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-1 ${formData.visibility === 'public' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                {formData.visibility === 'public' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
              </div>
              <div>
                <h4 className="font-medium">Aberto ao público</h4>
                <p className="text-sm text-gray-600">Seu evento aparecerá na página inicial do site e nas buscas.</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border cursor-pointer ${formData.visibility === 'private' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
               onClick={() => handleSelectChange('visibility', 'private')}>
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-1 ${formData.visibility === 'private' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                {formData.visibility === 'private' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
              </div>
              <div>
                <h4 className="font-medium">Evento privado</h4>
                <p className="text-sm text-gray-600">Seu evento não aparecerá na página inicial do site, no perfil do organizador e nem mesmo nas buscas. Somente quem tem o link do evento conseguirá encontrá-lo.</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border cursor-pointer ${formData.visibility === 'hidden' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
               onClick={() => handleSelectChange('visibility', 'hidden')}>
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-1 ${formData.visibility === 'hidden' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                {formData.visibility === 'hidden' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
              </div>
              <div>
                <h4 className="font-medium">Oculto</h4>
                <p className="text-sm text-gray-600">A página do seu evento não será exibida para o público, nem mesmo para quem tem o link do evento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do evento</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Insira observações acerca do evento (programação, recomendações, dicas e etc)"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Configuração dos ingressos</h3>
        <p className="text-gray-600">Informações de entrada</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nomenclatura</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={formData.ticket_type === 'free' ? 'default' : 'outline'}
              className="h-12"
              onClick={() => handleSelectChange('ticket_type', 'free')}
            >
              Ingresso
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12"
            >
              Inscrição
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tipo de ingresso</Label>
          <Select onValueChange={(value) => handleSelectChange("ticket_type", value)} value={formData.ticket_type}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Gratuito</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.ticket_type === "paid" && (
          <div className="space-y-2">
            <Label htmlFor="price">Preço *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Valor do ingresso"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacidade *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="Número máximo de participantes"
            value={formData.capacity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Taxa sobre as vendas</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="service_fee" defaultChecked className="accent-purple-600" />
              <label htmlFor="service_fee" className="text-sm">
                <span className="font-medium">Absorver taxa de serviço</span>
                <div className="text-gray-600">Se estiver marcada, você é quem irá pagar a taxa de serviço</div>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="installment_fee" className="accent-purple-600" />
              <label htmlFor="installment_fee" className="text-sm">
                <span className="font-medium">Absorver taxa de parcelamento</span>
                <div className="text-gray-600">Se estiver marcada, você é quem irá pagar a taxa de parcelamento</div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Formas de pagamento</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-purple-600 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
              </div>
              <span className="text-sm">Boleto</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
              </div>
              <span className="text-sm">Cartão de Crédito</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center">
                <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
              </div>
              <span className="text-sm">Pix</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Eventos realizados por pessoa física só podem aceitar pagamentos via boleto bancário. Para 
            utilizar as outras formas de pagamento, entre em contato com nosso suporte, ou publique seu 
            evento como pessoa jurídica.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Publicar Evento</DialogTitle>
          </DialogHeader>

          {renderStepIndicator()}

          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Voltar
                </Button>
              )}
              
              <div className="flex gap-2 ml-auto">
                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                    Confirmar e avançar
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                    {isLoading ? "Publicando..." : "Publicar evento"}
                  </Button>
                )}
              </div>
            </div>

            {currentStep === 3 && (
              <div className="text-center text-sm text-gray-500">
                Etapa {currentStep} de 3
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <CompleteProfileModal 
        open={showCompleteProfile} 
        onOpenChange={setShowCompleteProfile}
      />
    </>
  );
};

export default CreateEventModal;
