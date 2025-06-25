
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Calendar, MapPin, Download, QrCode } from "lucide-react";

const MyPurchases = () => {
  // Mock data para demonstração
  const purchases = [
    {
      id: "1",
      eventTitle: "Festival de Música 2024",
      eventDate: "2024-07-15",
      eventTime: "20:00",
      location: "São Paulo, SP",
      ticketType: "VIP",
      price: 150.00,
      status: "confirmed",
      qrCode: "ING-ABC123XY"
    },
    {
      id: "2",
      eventTitle: "Workshop de Marketing Digital",
      eventDate: "2024-06-30",
      eventTime: "14:00",
      location: "Rio de Janeiro, RJ",
      ticketType: "Standard",
      price: 0,
      status: "confirmed",
      qrCode: "ING-DEF456UV"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
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
        onCreateEventClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Minhas Compras</h1>
          
          {purchases.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">Você ainda não possui ingressos comprados.</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Explorar Eventos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{purchase.eventTitle}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(purchase.eventDate).toLocaleDateString('pt-BR')} às {purchase.eventTime}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {purchase.location}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      {getStatusBadge(purchase.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Tipo de Ingresso</h4>
                        <p className="text-lg">{purchase.ticketType}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Valor Pago</h4>
                        <p className="text-lg font-bold text-green-600">
                          {purchase.price === 0 ? 'Gratuito' : `R$ ${purchase.price.toFixed(2)}`}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Código QR</h4>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                          {purchase.qrCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4 mr-2" />
                        Ver QR Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Ingresso
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPurchases;
