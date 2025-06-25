
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import { Camera, Save, User, Mail, Phone, Calendar } from "lucide-react";

const MyProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    avatar: ""
  });

  const handleSave = () => {
    // Aqui implementaremos a lógica de salvar
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={() => {}}
        onCreateEventClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle>{user?.name || user?.email?.split('@')[0]}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <Badge className="mt-2 bg-green-100 text-green-800">Plano Gratuito</Badge>
              </CardHeader>
            </Card>
            
            {/* Profile Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Gerencie suas informações de perfil</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="w-4 h-4 inline mr-2" />
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="w-4 h-4 inline mr-2" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Membro desde
                    </Label>
                    <Input value="Janeiro 2024" disabled />
                  </div>
                </div>
                
                {isEditing && (
                  <Button onClick={handleSave} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Plan Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Plano e Assinatura</CardTitle>
              <CardDescription>Gerencie seu plano atual e histórico de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">Plano Atual</h3>
                  <p className="text-2xl font-bold">Gratuito</p>
                  <p className="text-sm text-gray-600">Eventos gratuitos apenas</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Eventos Criados</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Este mês</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Ingressos Vendidos</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
              
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Fazer Upgrade do Plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
