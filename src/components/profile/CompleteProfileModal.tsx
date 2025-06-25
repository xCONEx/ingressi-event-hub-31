
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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import TermsModal from "@/components/modals/TermsModal";
import PrivacyModal from "@/components/modals/PrivacyModal";
import { Checkbox } from "@/components/ui/checkbox";

interface CompleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CompleteProfileModal = ({ open, onOpenChange }: CompleteProfileModalProps) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    cpf: user?.cpf || "",
    phone: user?.phone || "",
    person_type: user?.person_type || "fisica" as const,
  });

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData({ ...formData, [name]: formatCpf(value) });
    } else if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePersonTypeChange = (type: 'fisica' | 'juridica') => {
    setFormData({ ...formData, person_type: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você deve aceitar os termos de uso e política de privacidade.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Perfil completado!",
        description: "Seu perfil foi atualizado com sucesso.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Complete seu Cadastro</DialogTitle>
            <DialogDescription className="text-center">
              Antes de publicar seu evento queremos saber um pouco mais sobre você.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Você é uma pessoa física ou jurídica?</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={formData.person_type === 'fisica' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePersonTypeChange('fisica')}
                  >
                    Pessoa Física
                  </Button>
                  <Button
                    type="button"
                    variant={formData.person_type === 'juridica' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePersonTypeChange('juridica')}
                  >
                    Pessoa Jurídica
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Celular *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Atribuições legais</h3>
              <p className="text-sm text-gray-600">
                Certifique-se de ter lido a{" "}
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="text-purple-600 hover:underline"
                >
                  Política de Privacidade
                </button>{" "}
                e os{" "}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="text-purple-600 hover:underline"
                >
                  Termos de Uso
                </button>{" "}
                da plataforma, em especial a parte que trata dos repasses. Observe que os repasses só serão realizados para contas bancárias de mesma titularidade do organizador.
              </p>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  Ao completar meu cadastro, declaro que estou de acordo com os termos de uso e ciente da política de privacidade da plataforma.
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !acceptedTerms} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Salvando..." : "Completar Cadastro"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <TermsModal open={termsModalOpen} onOpenChange={setTermsModalOpen} />
      <PrivacyModal open={privacyModalOpen} onOpenChange={setPrivacyModalOpen} />
    </>
  );
};

export default CompleteProfileModal;
