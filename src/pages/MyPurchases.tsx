
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Calendar, MapPin, Download, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Purchase {
  id: string;
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image_url?: string;
  };
  attendee_name: string;
  attendee_email: string;
  price: number;
  payment_status: string;
  qr_code: string;
  created_at: string;
}

const MyPurchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select(`
          id,
          attendee_name,
          attendee_email,
          price,
          payment_status,
          qr_code,
          created_at,
          events (
            id,
            title,
            date,
            time,
            location,
            image_url
          )
        `)
        .eq('attendee_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPurchases = tickets?.map(ticket => ({
        id: ticket.id,
        event: ticket.events as any,
        attendee_name: ticket.attendee_name,
        attendee_email: ticket.attendee_email,
        price: ticket.price,
        payment_status: ticket.payment_status,
        qr_code: ticket.qr_code,
        created_at: ticket.created_at
      })) || [];

      setPurchases(formattedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Erro ao carregar compras",
        description: "Não foi possível carregar suas compras.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleViewQRCode = (qrCode: string) => {
    toast({
      title: "QR Code",
      description: `Código: ${qrCode}`,
    });
  };

  const handleDownloadTicket = (purchase: Purchase) => {
    // Generate ticket download
    const ticketData = {
      event: purchase.event.title,
      date: new Date(purchase.event.date).toLocaleDateString('pt-BR'),
      time: purchase.event.time,
      location: purchase.event.location,
      attendee: purchase.attendee_name,
      qrCode: purchase.qr_code
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ingresso-${purchase.event.title.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={() => {}} onCreateEventClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Minhas Compras</h1>
            <div className="text-center py-8">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

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
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => window.location.href = '/events'}
                >
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
                      <div className="flex-1">
                        <CardTitle className="text-xl">{purchase.event.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(purchase.event.date).toLocaleDateString('pt-BR')} às {purchase.event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {purchase.event.location}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(purchase.payment_status)}
                        {purchase.event.image_url && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img 
                              src={purchase.event.image_url} 
                              alt={purchase.event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Participante</h4>
                        <p className="text-lg">{purchase.attendee_name}</p>
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
                          {purchase.qr_code}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewQRCode(purchase.qr_code)}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Ver QR Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadTicket(purchase)}
                      >
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
