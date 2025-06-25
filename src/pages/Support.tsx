
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageCircle, Mail, Phone, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Support = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve. Obrigado!",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ingrezzi
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center">
                  <Headphones className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">
                    Precisando de ajuda?
                    <br />
                    Estamos aqui para você!
                  </h2>
                  <p className="text-purple-100 text-lg">
                    Nossa equipe de suporte está pronta para
                    <br />
                    ajudar você a ter sucesso com seus eventos.
                  </p>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-pink-400 rounded-full opacity-80"></div>
                <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-20 w-10 h-10 bg-green-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-10 left-16 w-6 h-6 bg-orange-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-full max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                Central de Suporte
                <br />
                Ingrezzi
              </CardTitle>
              <CardDescription>
                Entre em contato conosco e tire suas dúvidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duvida-geral">Dúvida Geral</SelectItem>
                      <SelectItem value="problema-tecnico">Problema Técnico</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="evento">Criação de Evento</SelectItem>
                      <SelectItem value="ingresso">Ingressos</SelectItem>
                      <SelectItem value="sugestao">Sugestão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Descreva brevemente o assunto"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva sua dúvida ou problema detalhadamente"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t">
                <div className="text-center text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>WhatsApp: +55 (27) 99755-7004</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>contato@ingrezzi.com.br</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
