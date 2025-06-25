import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, CheckCircle, XCircle, ArrowLeft, Search, Shield } from "lucide-react";
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then(setHasCamera);
    
    // Check user authorization
    checkUserAuthorization();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const checkUserAuthorization = async () => {
    try {
      const storedUser = localStorage.getItem('ingrezzi_user');
      if (!storedUser) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para fazer check-in.",
          variant: "destructive",
        });
        return;
      }

      const user = JSON.parse(storedUser);
      setUserProfile(user);

      // Verificar se é organizador ou tem autorização para algum evento
      const { data: authorizations, error } = await supabase
        .from('event_authorizations')
        .select(`
          *,
          events (
            id,
            title,
            organizer_id
          )
        `)
        .eq('authorized_user_id', user.id)
        .eq('status', 'approved');

      if (error) throw error;

      // Também verificar se é organizador de algum evento
      const { data: ownedEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, title')
        .eq('organizer_id', user.id);

      if (eventsError) throw eventsError;

      const hasAuthorization = (authorizations && authorizations.length > 0) || (ownedEvents && ownedEvents.length > 0);
      setIsAuthorized(hasAuthorization);

      if (!hasAuthorization) {
        toast({
          title: "Acesso restrito",
          description: "Você não possui autorização para fazer check-in em eventos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    }
  };

  const handleTicketValidation = async (qrCode: string) => {
    if (!isAuthorized) {
      toast({
        title: "Acesso negado",
        description: "Você não possui autorização para fazer check-in.",
        variant: "destructive",
      });
      return;
    }

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
            location,
            organizer_id
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

      // Verificar se usuário tem autorização para este evento específico
      const canCheckIn = await verifyEventAuthorization(ticket.events.id, ticket.events.organizer_id);
      
      if (!canCheckIn) {
        toast({
          title: "Acesso negado",
          description: "Você não possui autorização para fazer check-in neste evento.",
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
          checked_in_by: userProfile?.id,
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

  const verifyEventAuthorization = async (eventId: string, organizerId: string) => {
    if (!userProfile) return false;

    // Se é o organizador do evento
    if (userProfile.id === organizerId) {
      return true;
    }

    // Verificar se tem autorização específica para este evento
    const { data: authorization } = await supabase
      .from('event_authorizations')
      .select('id')
      .eq('event_id', eventId)
      .eq('authorized_user_id', userProfile.id)
      .eq('status', 'approved')
      .single();

    return !!authorization;
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
            
            {userProfile && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className={`w-5 h-5 ${isAuthorized ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm ${isAuthorized ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthorized ? `Autorizado: ${userProfile.name}` : 'Sem autorização'}
                </span>
              </div>
            )}
          </div>

          {!isAuthorized && (
            <Alert className="mb-6">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Você não possui autorização para fazer check-in em eventos. 
                Entre em contato com o organizador do evento para solicitar acesso.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Camera Scanner */}
            {hasCamera && isAuthorized && (
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
            {isAuthorized && (
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
            )}

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
