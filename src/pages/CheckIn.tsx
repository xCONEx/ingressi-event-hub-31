
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, XCircle, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import QrScanner from "qr-scanner";

const CheckIn = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [lastScannedTicket, setLastScannedTicket] = useState<any>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then(setHasCamera);

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const handleTicketValidation = async (qrCode: string) => {
    try {
      // First, get the ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            id,
            title,
            date,
            time,
            location
          )
        `)
        .eq('qr_code', qrCode.trim())
        .single();

      if (ticketError || !ticket) {
        toast({
          title: "Ingresso não encontrado",
          description: "Código QR inválido ou ingresso não existe.",
          variant: "destructive",
        });
        return;
      }

      if (ticket.checked_in) {
        toast({
          title: "Ingresso já utilizado",
          description: `Check-in realizado em ${new Date(ticket.checked_in_at).toLocaleString('pt-BR')}`,
          variant: "destructive",
        });
        setLastScannedTicket(ticket);
        return;
      }

      // Perform check-in
      const { error: checkinError } = await supabase
        .from('tickets')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        })
        .eq('id', ticket.id);

      if (checkinError) {
        toast({
          title: "Erro no check-in",
          description: "Não foi possível realizar o check-in. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Create check-in record
      await supabase
        .from('checkins')
        .insert([{
          ticket_id: ticket.id,
          event_id: ticket.event_id,
        }]);

      toast({
        title: "Check-in realizado com sucesso!",
        description: `Bem-vindo(a), ${ticket.attendee_name}!`,
      });

      setLastScannedTicket({ ...ticket, checked_in: true, checked_in_at: new Date().toISOString() });

    } catch (error) {
      console.error('Error validating ticket:', error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !hasCamera) return;

    try {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          handleTicketValidation(result.data);
          // Stop scanning briefly to avoid multiple scans
          setTimeout(() => {
            if (qrScannerRef.current) {
              qrScannerRef.current.start();
            }
          }, 2000);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
      setIsScanning(true);
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleTicketValidation(manualCode);
      setManualCode("");
    }
  };

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

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Check-in de Ingressos</h1>
            <p className="text-gray-600">Escaneie o QR Code ou digite o código manualmente</p>
          </div>

          <div className="space-y-6">
            {/* Camera Scanner */}
            {hasCamera && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Scanner QR Code
                  </CardTitle>
                  <CardDescription>
                    Use a câmera para escanear o código QR do ingresso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <video 
                        ref={videoRef}
                        className="w-full rounded-lg"
                        style={{ maxHeight: '400px' }}
                      />
                      {!isScanning && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Button onClick={startScanning}>
                            <Camera className="w-4 h-4 mr-2" />
                            Iniciar Scanner
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {isScanning && (
                      <Button variant="outline" onClick={stopScanning} className="w-full">
                        Parar Scanner
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Manual Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Código Manual
                </CardTitle>
                <CardDescription>
                  Digite o código do ingresso manualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <Input
                    placeholder="Ex: ING-ABC12345"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="text-center font-mono"
                  />
                  <Button type="submit" className="w-full">
                    Validar Ingresso
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Last Scanned Ticket */}
            {lastScannedTicket && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {lastScannedTicket.checked_in ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Check-in Realizado
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                        Ingresso Já Utilizado
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Participante:</span>
                      <span>{lastScannedTicket.attendee_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">E-mail:</span>
                      <span>{lastScannedTicket.attendee_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Evento:</span>
                      <span>{lastScannedTicket.events?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Código:</span>
                      <span className="font-mono">{lastScannedTicket.qr_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={lastScannedTicket.checked_in ? "default" : "destructive"}>
                        {lastScannedTicket.checked_in ? "Check-in OK" : "Já utilizado"}
                      </Badge>
                    </div>
                    {lastScannedTicket.checked_in_at && (
                      <div className="flex justify-between">
                        <span className="font-medium">Data/Hora:</span>
                        <span>{new Date(lastScannedTicket.checked_in_at).toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!hasCamera && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-800 text-center">
                    Câmera não disponível. Use o código manual para fazer check-in.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
